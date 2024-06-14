import { Router } from "express";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { StatusCodes } from "http-status-codes";
import { authMiddleware } from "../../middlewares/authMiddleWare";
import { s3Client } from "../../configs/awsConfigs";

const cloudRouter = Router();

cloudRouter.get("/presigned-url", authMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    try {
        const { url, fields } = await createPresignedPost(s3Client, {
            Bucket: "tweet-video-mine",
            Key: `data/${userId}/${Math.random()}/item`,
            Conditions: [
                ["content-length-range", 0, 250 * 1024 * 1024], // 250 MB max
            ],
            Expires: 3600,
        });
        return res.json({ preSignedURL: url, fields });
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "error" });
    }
});

export default cloudRouter;
