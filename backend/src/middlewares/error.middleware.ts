import { Request, Response, NextFunction } from "express";

// Async error handler
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handler
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);
    res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
};
