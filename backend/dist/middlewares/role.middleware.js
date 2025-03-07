"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({ message: "Forbidden" });
        return; //  Ensure function exits after sending response
    }
    next(); //  Ensures proper middleware flow
};
exports.isAdmin = isAdmin;
