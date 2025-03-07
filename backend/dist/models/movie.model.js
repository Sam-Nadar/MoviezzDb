"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MovieSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    rating: Number,
    releaseDate: String,
    duration: Number,
    genre: String,
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
});
exports.default = mongoose_1.default.model("Movie", MovieSchema);
