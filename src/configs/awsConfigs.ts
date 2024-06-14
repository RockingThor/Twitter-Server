import { S3Client } from "@aws-sdk/client-s3";
import { ECSClient } from "@aws-sdk/client-ecs";

export const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_R || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_R || "",
    },
    region: "us-east-1",
});

export const ecsClient = new ECSClient({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_R || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_R || "",
    },
});

export const clusterConfig = {
    CLUSTER: process.env.AWS_CLUSTER_R || "",
    TASK: process.env.AWS_TASK_DEF_R || "",
};
