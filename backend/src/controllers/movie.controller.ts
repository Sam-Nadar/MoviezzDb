import { Request, Response } from "express";
import Movie from "../models/movie.model";
import { publishToQueue, consumeQueue } from "../utils/messageQueue";
import { asyncHandler } from "../middlewares/error.middleware";

//  Get all movies
export const getMovies = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1; //  Default: Page 1
    const limit = parseInt(req.query.limit as string) || 5; //  Default: 5 movies per page
    const skip = (page - 1) * limit;

    const movies = await Movie.find().skip(skip).limit(limit);
    const totalMovies = await Movie.countDocuments(); //  Get total count

    res.json({
        totalMovies,
        totalPages: Math.ceil(totalMovies / limit),
        currentPage: page,
        movies
    });
});


//  Get sorted movies by query parameter
export const getSortedMovies = asyncHandler(async (req: Request, res: Response) => {
    const { sortBy, page, limit } = req.query;

    //  Updated: Remove releaseDate from valid sort fields
    const validSortFields = ["title", "rating", "duration"];
    if (!sortBy || !validSortFields.includes(sortBy as string)) {
        return res.status(400).json({ message: "Invalid sort field" });
    }

    //  Convert page and limit to numbers with defaults
    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 5;
    const skip = (pageNumber - 1) * pageSize;

    //  Get total movies count (needed for frontend pagination)
    const totalMovies = await Movie.countDocuments();

    //  Fetch sorted movies with pagination
    const sortedMovies = await Movie.find()
        .sort({ [sortBy as string]: 1 }) // Ascending order
        .skip(skip)
        .limit(pageSize);

    res.json({
        totalMovies,
        totalPages: Math.ceil(totalMovies / pageSize),
        currentPage: pageNumber,
        movies: sortedMovies
    });
});


//  Search movies by name or description
export const searchMovies = asyncHandler(async (req: Request, res: Response) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
    }

    const movies = await Movie.find({
        $or: [
            { title: { $regex: query as string, $options: "i" } },
            { description: { $regex: query as string, $options: "i" } },
        ],
    });

    res.json(movies);
});

export const addMovie = asyncHandler(async (req: Request, res: Response) => {
    const movies = Array.isArray(req.body) ? req.body : [req.body]; //  Always ensure an array

    for (const movieData of movies) {
        publishToQueue(movieData); //  Send each movie individually to the queue
        console.log("📩 Movie sent to queue:", movieData);
    }

    res.status(202).json({ message: "Movies added to queue for processing", count: movies.length });
});


//  Edit movie details (Admin only)
export const editMovie = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const updatedMovie = await Movie.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedMovie) {
        return res.status(404).json({ message: "Movie not found" });
    }

    res.json(updatedMovie);
});

//  Delete movie
export const deleteMovie = asyncHandler(async (req: Request, res: Response) => {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: "Movie deleted successfully" });
});

//  Process queue messages
export const processMovieQueue = async () => {
    consumeQueue(async (movieData: { title: string; description: string; rating: number; releaseDate: string; duration: number }) => {
        const movie = new Movie(movieData);
        await movie.save();
        console.log("Movie saved from queue:", movie);
    });
};
