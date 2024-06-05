import { Request, Response } from "express";
import prisma from "../configs/dbConfig";
import { StatusCodes } from "http-status-codes";

export async function fetchTweet(req: Request, res: Response) {
    try {
        const { skip } = req.body;

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

        return res.status(StatusCodes.OK).json({ tweets });
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "error" });
    }
}
