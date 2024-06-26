import express from "express";
import "dotenv/config";
import cors from "cors";
import v1router from "./router/v1/router";
import { PORT } from "./configs/envConfigs";
import proxyRouter from "./router/v1/proxy";

const app = express();
app.use(cors());

app.use(express.json());

app.use("/v1", v1router);
app.use("/proxy", proxyRouter);

app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
});

app.get("/ping", async (req, res) => {
    res.send("pong");
});
