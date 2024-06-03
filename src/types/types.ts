import { Request } from "express";

export interface AuthenticatedRequests extends Request {
    userId: number;
}

export interface User {
    name: string;
    username: string;
    imageURL: string;
}

export interface Tweet {
    id: number;
}

export interface UserWithDetails extends User {
    backgroundImageURL: string;
    followerCount: number;
    followingCount: number;
    bio: string;
    tweets: Tweet[];
}
