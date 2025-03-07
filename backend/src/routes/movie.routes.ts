import express from "express";
import { getMovies, getSortedMovies, searchMovies, addMovie, editMovie, deleteMovie } from "../controllers/movie.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";
import { asyncHandler } from "../middlewares/error.middleware";

const router = express.Router();

//  Get all movies
router.get("/", (getMovies));

//  Get sorted movies (e.g., ?sortBy=rating)
router.get("/sorted", (getSortedMovies));

//  Search movies by title or description (e.g., ?query=Avengers)
router.get("/search", (searchMovies));

//  Add movie (Admin only)
router.post("/", authenticateJWT, isAdmin, addMovie);

//  Edit movie details (Admin only)
router.put("/:id", authenticateJWT, isAdmin, editMovie);

//  Delete movie (Admin only)
router.delete("/:id", authenticateJWT, isAdmin, deleteMovie);

export default router;
