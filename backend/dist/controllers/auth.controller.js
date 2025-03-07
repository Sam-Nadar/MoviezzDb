"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = exports.login = exports.register = void 0;
const user_models_1 = __importDefault(require("../models/user.models")); //  FIX: Ensure correct filename
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../config/env");
const error_middleware_1 = require("../middlewares/error.middleware");
exports.register = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    //  Check if user exists
    const existingUser = yield user_models_1.default.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    //  Hash password only once
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    //  Save user with hashed password
    const user = new user_models_1.default({ username, email, password: hashedPassword, role: "user" });
    yield user.save();
    res.status(201).json({ message: "User registered successfully" });
}));
//  Login User (with JWT token & proper error handling)
exports.login = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_models_1.default.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }
    // Compare hashed password
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }
    // Generate JWT Token
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, env_1.ENV.JWT_SECRET, { expiresIn: "300h" });
    res.json({ token });
}));
//  Admin Login Route (Automatically assigns admin role)
exports.adminLogin = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(" adminLogin function triggered");
    const { email, password } = req.body;
    console.log("Checking login for:", email);
    const user = yield user_models_1.default.findOne({ email });
    if (!user) {
        console.log("❌ User not found!");
        return res.status(404).json({ message: "User not found" });
    }
    console.log("Provided Password:", password);
    console.log("Stored Password Hash:", user.password);
    //  Log bcrypt.compare() output
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    console.log("bcrypt.compare result:", isMatch);
    if (!isMatch) {
        console.log("❌ Password does not match!");
        return res.status(401).json({ message: "Invalid Credentials" });
    }
    if (user.role !== "admin") {
        user.role = "admin";
        yield user.save();
        console.log(" User role updated to admin for:", user.email);
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: "admin" }, env_1.ENV.JWT_SECRET, { expiresIn: "300h" });
    console.log(" User successfully logged in as admin:", user.email);
    res.json({ token, message: "User is now an admin and logged in successfully" });
}));
