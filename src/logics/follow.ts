import { Request, Response } from "express";
import prisma from "../configs/dbConfig";
import { StatusCodes } from "http-status-codes";

export async function getWhomTOFollow(req: Request, res: Response) {
    //@ts-ignore
    const userId = req?.userId;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                following: {
                    select: {
                        details: true,
                    },
                },
            },
        });

        const followingIds = user?.following
            ? user.following.details.map((user) => user.id)
            : [];

        const usersNotFollowed = await prisma.user.findMany({
            where: {
                id: { notIn: followingIds.concat(userId) },
            },
            take: 5,
            select: {
                name: true,
                username: true,
                id: true,
                profileImage: true,
            },
        });

        return res.status(StatusCodes.ACCEPTED).json(usersNotFollowed);
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Something went wrong" });
    }
}

export async function followAPerson(req: Request, res: Response) {
    //@ts-ignore
    const userId = req?.userId;

    try {
        const { personId } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (user?.followingId) {
            const response = await prisma.$transaction(async (prisma) => {
                const following = await prisma.following.update({
                    where: {
                        id: user.followingId || 0,
                    },
                    data: {
                        count: { increment: 1 },
                        details: { connect: { id: personId } },
                    },
                });

                const tragetUser = await prisma.user.findUnique({
                    where: {
                        id: personId,
                    },
                });

                const follower = await prisma.followers.update({
                    where: {
                        id: tragetUser?.followersId || 0,
                    },
                    data: {
                        count: { increment: 1 },
                        details: { connect: { id: userId } },
                    },
                });
                return following;
            });
            return res
                .status(StatusCodes.ACCEPTED)
                .json({ count: response.count });
        } else {
            res.status(StatusCodes.CONFLICT).json({
                message: "Something went wrong",
            });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Something went wrong" });
    }
}
