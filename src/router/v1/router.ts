import { Router } from "express";
import { signIn, signUp } from "../../logics/authLogic";

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

export default v1router;
