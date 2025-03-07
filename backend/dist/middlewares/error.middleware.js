"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.asyncHandler = void 0;
// Async error handler
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
// Global error handler
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
};
exports.errorHandler = errorHandler;
