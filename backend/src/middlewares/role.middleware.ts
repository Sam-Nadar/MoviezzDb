import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware"; // Ensure AuthRequest is imported

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({ message: "Forbidden" });
        return; //  Ensure function exits after sending response
    }
    next(); //  Ensures proper middleware flow
};
