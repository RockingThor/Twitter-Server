import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/envConfigs";
import { AuthenticatedRequests } from "../types/types";

export async function authMiddleware(
    req: AuthenticatedRequests,
    res: Response,
    next: NextFunction
) {
    const authorization = req.headers.authorization;

    if (!authorization)
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "Unauthorized" });

    const decryptedData = jwt.verify(authorization, JWT_SECRET) as {
        userId: number;
    };

    req.userId = decryptedData.userId;
    next();
}
