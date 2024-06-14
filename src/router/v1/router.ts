import { Response, Router } from "express";
import { signIn, signUp } from "../../logics/authLogic";
import { validateUsername } from "../../logics/validateUsername";
import { authMiddleware } from "../../middlewares/authMiddleWare";
import { AuthenticatedRequests } from "../../types/types";
import { StatusCodes } from "http-status-codes";
import {
    profileLogicWithAuthHeader,
    profileLogicWithoutAuthHeader,
} from "../../logics/profileLogic";
import {
    fetchProfileTweet,
    likeTweet,
    writeTweet,
} from "../../logics/tweetLogic";
import { fetchTweet } from "../../logics/fetchTweet";
import { followAPerson, getWhomTOFollow } from "../../logics/follow";
import cloudRouter from "./cloudTrx";

const v1router = Router();

v1router.use("/cloud", cloudRouter);

v1router.post("/ping", async (req, res) => {
    res.send("pong");
});

v1router.post("/signup", async (req, res) => {
    signUp(req, res);
});

v1router.post("/signin", async (req, res) => {
    signIn(req, res);
});

v1router.post("/validate-username", async (req, res) => {
    validateUsername(req, res);
});

v1router.get("/validate-token", authMiddleware, async (req, res) => {
    return res.status(StatusCodes.ACCEPTED).json({ success: true });
});

v1router.get("/me", authMiddleware, async (req, res) => {
    profileLogicWithAuthHeader(req, res);
});

v1router.get("/profile", async (req, res) => {
    profileLogicWithoutAuthHeader(req, res);
});

v1router.post("/tweet", authMiddleware, async (req, res) => {
    writeTweet(req, res);
});

v1router.post("/like-a-post", authMiddleware, async (req, res) => {
    likeTweet(req, res);
});

v1router.post("/fetchTweet", authMiddleware, async (req, res) => {
    fetchTweet(req, res);
});

v1router.get("/whom-to-follow", authMiddleware, async (req, res) => {
    getWhomTOFollow(req, res);
});

v1router.post("/follow-a-person", authMiddleware, async (req, res) => {
    followAPerson(req, res);
});

v1router.post("/fetch-profile-tweet", async (req, res) => {
    fetchProfileTweet(req, res);
});

export default v1router;
