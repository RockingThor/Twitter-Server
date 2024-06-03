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

const v1router = Router();

v1router.post("/ping", async (req, res) => {
    res.send("pong");
});

v1router.post("/signup", async (req, res) => {
    signUp(req, res);
});

v1router.post("/signin", async (req, res) => {
    signIn(req, res);
});

v1router.get("/validate-username", async (req, res) => {
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

export default v1router;
