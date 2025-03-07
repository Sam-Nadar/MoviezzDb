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
exports.processMovieQueue = exports.deleteMovie = exports.editMovie = exports.addMovie = exports.searchMovies = exports.getSortedMovies = exports.getMovies = void 0;
const movie_model_1 = __importDefault(require("../models/movie.model"));
const messageQueue_1 = require("../utils/messageQueue");
const error_middleware_1 = require("../middlewares/error.middleware");
//  Get all movies
exports.getMovies = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1; //  Default: Page 1
    const limit = parseInt(req.query.limit) || 5; //  Default: 5 movies per page
    const skip = (page - 1) * limit;
    const movies = yield movie_model_1.default.find().skip(skip).limit(limit);
    const totalMovies = yield movie_model_1.default.countDocuments(); //  Get total count
    res.json({
        totalMovies,
        totalPages: Math.ceil(totalMovies / limit),
        currentPage: page,
        movies
    });
}));
//  Get sorted movies by query parameter
exports.getSortedMovies = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sortBy, page, limit } = req.query;
    //  Updated: Remove releaseDate from valid sort fields
    const validSortFields = ["title", "rating", "duration"];
    if (!sortBy || !validSortFields.includes(sortBy)) {
        return res.status(400).json({ message: "Invalid sort field" });
    }
    //  Convert page and limit to numbers with defaults
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 5;
    const skip = (pageNumber - 1) * pageSize;
    //  Get total movies count (needed for frontend pagination)
    const totalMovies = yield movie_model_1.default.countDocuments();
    //  Fetch sorted movies with pagination
    const sortedMovies = yield movie_model_1.default.find()
        .sort({ [sortBy]: 1 }) // Ascending order
        .skip(skip)
        .limit(pageSize);
    res.json({
        totalMovies,
        totalPages: Math.ceil(totalMovies / pageSize),
        currentPage: pageNumber,
        movies: sortedMovies
    });
}));
//  Search movies by name or description
exports.searchMovies = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
    }
    const movies = yield movie_model_1.default.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
        ],
    });
    res.json(movies);
}));
exports.addMovie = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movies = Array.isArray(req.body) ? req.body : [req.body]; //  Always ensure an array
    for (const movieData of movies) {
        (0, messageQueue_1.publishToQueue)(movieData); //  Send each movie individually to the queue
        console.log("📩 Movie sent to queue:", movieData);
    }
    res.status(202).json({ message: "Movies added to queue for processing", count: movies.length });
}));
//  Edit movie details (Admin only)
exports.editMovie = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    const updatedMovie = yield movie_model_1.default.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedMovie) {
        return res.status(404).json({ message: "Movie not found" });
    }
    res.json(updatedMovie);
}));
//  Delete movie
exports.deleteMovie = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield movie_model_1.default.findByIdAndDelete(req.params.id);
    res.json({ message: "Movie deleted successfully" });
}));
//  Process queue messages
const processMovieQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, messageQueue_1.consumeQueue)((movieData) => __awaiter(void 0, void 0, void 0, function* () {
        const movie = new movie_model_1.default(movieData);
        yield movie.save();
        console.log("Movie saved from queue:", movie);
    }));
});
exports.processMovieQueue = processMovieQueue;
