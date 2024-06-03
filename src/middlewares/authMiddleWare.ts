import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/envConfigs";
import { AuthenticatedRequests } from "../types/types";

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // console.log("Was here");
    const authorization = req.headers.authorization;
    // console.log(authorization);

    if (!authorization)
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "Unauthorized" });

    const decryptedData = jwt.verify(authorization, JWT_SECRET) as {
        userId: number;
    };

    //@ts-ignore
    req.userId = decryptedData.userId;
    next();
}
