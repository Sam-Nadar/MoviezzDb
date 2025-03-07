import { Request, Response, NextFunction } from "express";
import User from "../models/user.models"; //  FIX: Ensure correct filename
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ENV } from "../config/env";
import { asyncHandler } from "../middlewares/error.middleware";


export const register = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    //  Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    //  Hash password only once
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Save user with hashed password
    const user = new User({ username, email, password: hashedPassword, role: "user" });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
});


//  Login User (with JWT token & proper error handling)
export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
        { id: user._id, role: user.role },
        ENV.JWT_SECRET,
        { expiresIn: "300h" }
    );

    res.json({ token });
});


//  Admin Login Route (Automatically assigns admin role)
export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
    // console.log(" adminLogin function triggered");

    const { email, password } = req.body;

    // console.log("Checking login for:", email);

    const user = await User.findOne({ email });

    if (!user) {
        // console.log("❌ User not found!");
        return res.status(404).json({ message: "User not found" });
    }

    // console.log("Provided Password:", password);
    // console.log("Stored Password Hash:", user.password);

    //  Log bcrypt.compare() output
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log("bcrypt.compare result:", isMatch);

    if (!isMatch) {
        // console.log("❌ Password does not match!");
        return res.status(401).json({ message: "Invalid Credentials" });
    }

    if (user.role !== "admin") {
        user.role = "admin";
        await user.save();
        // console.log(" User role updated to admin for:", user.email);
    }

    const token = jwt.sign(
        { id: user._id, role: "admin" },
        ENV.JWT_SECRET,
        { expiresIn: "300h" }
    );

    // console.log(" User successfully logged in as admin:", user.email);
    res.json({ token, message: "User is now an admin and logged in successfully" });
});

