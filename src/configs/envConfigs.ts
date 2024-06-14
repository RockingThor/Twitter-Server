import "dotenv/config";

export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const AWS_ACCESS_KEY_R = process.env.AWS_ACCESS_KEY_R || "";
export const AWS_SECRET_ACCESS_KEY_R =
    process.env.AWS_SECRET_ACCESS_KEY_R || "";
