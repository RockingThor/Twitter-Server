import { Router } from "express";
import request from "request";

const proxyRouter = Router();

proxyRouter.use(async (req, res) => {
    const url = "https://d2lff49aaqvgse.cloudfront.net/twitter/2/3/index.m3u8";
    if (!url) {
        return res.status(400).send("URL is required");
    }
    return request(url).pipe(res);
});

export default proxyRouter;
