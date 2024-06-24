import "dotenv/config";

export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const AWS_ACCESS_KEY_R = process.env.AWS_ACCESS_KEY_R || "";
export const AWS_SECRET_ACCESS_KEY_R =
    process.env.AWS_SECRET_ACCESS_KEY_R || "";
export const URL = process.env.URL || "http://localhost:3000";

export const REDIS_HOST = process.env.REDIS_HOST || "localhost";
export const REDIS_PORT = process.env.REDIS_PORT || "6379";
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";
