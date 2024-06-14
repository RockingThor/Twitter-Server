import { RunTaskCommand } from "@aws-sdk/client-ecs";
import { clusterConfig, ecsClient } from "../configs/awsConfigs";
import {
    AWS_ACCESS_KEY_R,
    AWS_SECRET_ACCESS_KEY_R,
} from "../configs/envConfigs";

export async function spinTheTrancoderContainerFargate(
    videoURL: string,
    tweetId: number
) {
    const command = new RunTaskCommand({
        cluster: clusterConfig.CLUSTER,
        taskDefinition: clusterConfig.TASK,
        launchType: "FARGATE",
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: "ENABLED",
                subnets: [
                    "subnet-0f8123f110182d9f2",
                    "subnet-08c7df0a54b9e3776",
                    "subnet-06c1ad638b7f2197f",
                    "subnet-006fdd3ced87234d1",
                    "subnet-08cda89c25f1c0373",
                    "subnet-0f943ec5779fffdde",
                ],
                securityGroups: ["sg-033f48de58196b4d2"],
            },
        },
        overrides: {
            containerOverrides: [
                {
                    name: "transcoder-image",
                    environment: [
                        { name: "VIDEO_URL", value: videoURL },
                        { name: "AWS_ACCESS_KEY_R", value: AWS_ACCESS_KEY_R },
                        {
                            name: "AWS_SECRET_ACCESS_KEY_R",
                            value: AWS_SECRET_ACCESS_KEY_R,
                        },
                        { name: "USER_ID", value: "tweetId" },
                        { name: "TWEET_ID", value: tweetId.toString() },
                    ],
                },
            ],
        },
    });

    await ecsClient.send(command);
    return { status: "Container queued", response: true };
}
