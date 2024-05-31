import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../configs/dbConfig";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/envConfigs";

export async function signUp(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findFirst({
        where: {
            email,
        },
    });

    if (existingUser) {
        return res
            .status(StatusCodes.CONFLICT)
            .json({ message: "Email already exists" });
    }

    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword,
        },
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

    const exisistingUser = await prisma.user.findFirst({
        where: {
            email,
        },
    });

    if (!exisistingUser)
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "User not found" });

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
