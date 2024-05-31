import express from "express";
import "dotenv/config";
import cors from "cors";
import v1router from "./router/v1/router";

const app = express();
app.use(cors());

app.use(express.json());

app.use("/v1", v1router);

app.listen(3000, () => {
    console.log("App is running on PORT 3000");
});

app.get("/ping", async (req, res) => {
    res.send("pong");
});
