import { Request, Response } from "express";
import prisma from "../configs/dbConfig";
import { StatusCodes } from "http-status-codes";
import { spinTheTrancoderContainerFargate } from "./AWSLogic";

export async function writeTweet(req: Request, res: Response) {
    try {
        //@ts-ignore
        const userId = req.userId;
        const { content, videoURL } = req.body;

        //TODO: Add image suppport

        const tweet = await prisma.$transaction(async (prisma) => {
            const tweetWithoutLike = await prisma.tweet.create({
                data: {
                    content,
                    authorId: userId,
                    video: videoURL.length > 1 ? true : false,
                },
            });

            const like = await prisma.like.create({
                data: {
                    tweetId: tweetWithoutLike.id,
                    count: 0,
                },
            });

            const tweetWithLike = await prisma.tweet.update({
                where: {
                    id: tweetWithoutLike.id,
                },
                data: {
                    likeId: like.id,
                },
                include: {
                    author: {
                        select: {
                            name: true,
                            username: true,
                            profileImage: true,
                        },
                    },
                },
            });

            if (videoURL.length > 1) {
                const res = await spinTheTrancoderContainerFargate(
                    videoURL,
                    tweetWithoutLike.id
                );
                console.log(res);
            }

            return tweetWithLike;
        });
        return res.status(StatusCodes.CREATED).json({ tweetId: tweet.id });
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Something went wrong" });
    }
}

function findAndDelete(arr: number[], target: number): boolean {
    const index = arr.indexOf(target);

    if (index !== -1) {
        arr.splice(index, 1);
        return true;
    }

    return false;
}

export async function likeTweet(req: Request, res: Response) {
    try {
        //@ts-ignore
        const userId = req.userId;
        const { tweetId } = req.body;

        const like = await prisma.like.findFirst({
            where: {
                tweetId,
            },
        });
        if (like?.details) {
            const result = findAndDelete(like?.details, userId);
            if (result) {
                return res.status(StatusCodes.OK).json({ isLiked: false });
            } else {
                let newLike = like.details;
                newLike.push(userId);
                const updated = await prisma.like.update({
                    where: {
                        tweetId,
                    },
                    data: {
                        details: newLike,
                    },
                });
                return res.status(StatusCodes.OK).json({ isLiked: true });
            }
        }
        return res.status(StatusCodes.OK).json({ isLiked: true });
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal server error" });
    }
}

export async function fetchProfileTweet(req: Request, res: Response) {
    try {
        const { skip, username } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (!user) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "User not found" });
        }

        const tweets = await prisma.tweet.findMany({
            where: {
                authorId: Number(user.id),
            },
            skip: Number(skip),
            take: 10,
            include: {
                like: {
                    select: {
                        count: true,
                    },
                },
                imageUrls: true,
            },
        });
        return res.status(StatusCodes.OK).json({ tweets });
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "SOmething went wrong" });
    }
}
