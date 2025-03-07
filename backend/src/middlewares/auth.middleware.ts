import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Access Denied" });
        return;
    }

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string; role: string };
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid Token" });
    }
};
