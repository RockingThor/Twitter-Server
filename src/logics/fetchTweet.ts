import { Request, Response } from "express";
import prisma from "../configs/dbConfig";
import { StatusCodes } from "http-status-codes";
import { redisClient } from "../configs/redisConfig";

export async function fetchTweet(req: Request, res: Response) {
    try {
        const { skip } = req.body;
        const cacheKey = `tweets:${skip}`;

        const cachedTweets = await redisClient.get(cacheKey);

        if (cachedTweets) {
            console.log("Tweets fetched from cache");
            return res
                .status(StatusCodes.OK)
                .json({ tweets: JSON.parse(cachedTweets) });
        }
        const tweets = await prisma.tweet.findMany({
            skip: Number(skip),
            take: 10,
            include: {
                author: {
                    select: {
                        username: true,
                        name: true,
                        profileImage: true,
                    },
                },
                like: {
                    select: {
                        count: true,
                    },
                },
            },
        });

        await redisClient.set(cacheKey, JSON.stringify(tweets), "EX", 60 * 10);

        return res.status(StatusCodes.OK).json({ tweets });
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "error" });
    }
}
