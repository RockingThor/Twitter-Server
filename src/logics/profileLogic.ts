import { Request, Response } from "express";
import prisma from "../configs/dbConfig";
import { StatusCodes } from "http-status-codes";
import { Tweet, UserWithDetails } from "../types/types";

export async function profileLogicWithoutAuthHeader(
    req: Request,
    res: Response
) {
    const username = req.query.username;

    const user = await prisma.user.findFirst({
        where: {
            username: username?.toString(),
        },
        include: {
            followers: true,
            following: true,
            Tweets: true,
        },
    });

    if (!user) {
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "User not found" });
    }

    const tweets: Tweet[] = [];
    if (user.Tweets.length > 0) {
        user.Tweets.forEach((tweet) => {
            tweets.push({
                id: tweet.id,
            });
        });
    }

    const data: UserWithDetails = {
        name: user.name,
        username: user.username,
        imageURL: user.profileImage || "",
        backgroundImageURL: user.backgroundImage || "",
        bio: user.bio,
        followerCount: user.followers?.count || 0,
        followingCount: user.following?.count || 0,
        tweets: tweets,
    };

    return res.status(StatusCodes.ACCEPTED).json({ profile: data });
}

export async function profileLogicWithAuthHeader(req: Request, res: Response) {
    const user = await prisma.user.findFirst({
        where: {
            //@ts-ignore
            id: req.userId,
        },
        include: {
            followers: true,
            following: true,
            Tweets: true,
        },
    });

    if (!user) {
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "User not found" });
    }
    const tweets: Tweet[] = [];
    if (user.Tweets.length > 0) {
        user.Tweets.forEach((tweet) => {
            tweets.push({
                id: tweet.id,
            });
        });
    }

    const data: UserWithDetails = {
        name: user.name,
        username: user.username,
        imageURL: user.profileImage || "",
        backgroundImageURL: user.backgroundImage || "",
        bio: user.bio,
        followerCount: user.followers?.count || 0,
        followingCount: user.following?.count || 0,
        tweets: tweets,
    };

    return res.status(StatusCodes.ACCEPTED).json({ profile: data });
}
