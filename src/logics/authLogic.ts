import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../configs/dbConfig";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/envConfigs";

export async function signUp(req: Request, res: Response) {
    const { name, email, password, username } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUserUsingEmail = await prisma.user.findFirst({
        where: {
            email,
        },
    });

    const existingUserUsingUsername = await prisma.user.findFirst({
        where: {
            username,
        },
    });

    if (existingUserUsingEmail || existingUserUsingUsername) {
        return res
            .status(StatusCodes.CONFLICT)
            .json({ message: "Email or username already exists" });
    }

    const user = await prisma.$transaction(async (prisma) => {
        const oldUser = await prisma.user.create({
            data: {
                username,
                name,
                email,
                hashedPassword,
            },
        });

        const followers = await prisma.followers.create({
            data: {
                count: 0,
            },
        });

        const following = await prisma.following.create({
            data: {
                count: 0,
            },
        });

        const user = await prisma.user.update({
            where: {
                id: oldUser.id,
            },
            data: {
                followersId: followers.id,
                followingId: following.id,
            },
        });

        return user;
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
    });

    return res.status(StatusCodes.OK).json({
        message: "Sign up successful",
        token,
    });
}

export async function signIn(req: Request, res: Response) {
    const { email, password } = req.body;

    const exisistingUserByEmail = await prisma.user.findFirst({
        where: {
            email,
        },
    });

    const exisistingUserByUsername = await prisma.user.findFirst({
        where: {
            username: email,
        },
    });

    if (!exisistingUserByEmail && !exisistingUserByUsername)
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "User not found" });

    let exisistingUser: any = null;

    if (!exisistingUserByUsername) exisistingUser = exisistingUserByEmail;
    else exisistingUser = exisistingUserByUsername;

    const isMatch = await bcrypt.compare(
        password,
        exisistingUser.hashedPassword
    );

    if (!isMatch)
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: exisistingUser.id }, JWT_SECRET, {
        expiresIn: "7d",
    });

    return res.status(StatusCodes.OK).json({
        message: "Sign in successful",
        token,
    });
}
