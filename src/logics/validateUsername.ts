import { Request, Response } from "express";
import prisma from "../configs/dbConfig";
import { StatusCodes } from "http-status-codes";

export async function validateUsername(req: Request, res: Response) {
    const { username } = req.params;
    const user = await prisma.user.findFirst({
        where: {
            username,
        },
    });

    if (user?.id) {
        return res
            .status(StatusCodes.CONFLICT)
            .json({ message: "Username already exists", success: false });
    } else {
        return res.status(StatusCodes.ACCEPTED).json({
            message: "Username available",
            success: true,
        });
    }
}
