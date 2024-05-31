import { Router } from "express";

const v1router = Router();

v1router.post("/ping", async (req, res) => {
    res.send("pong");
});

export default v1router;
