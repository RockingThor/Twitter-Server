import { Request } from "express";

export interface AuthenticatedRequests extends Request {
    userId: number;
}
