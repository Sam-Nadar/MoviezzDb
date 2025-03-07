"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const movie_controller_1 = require("../controllers/movie.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = express_1.default.Router();
//  Get all movies
router.get("/", (movie_controller_1.getMovies));
//  Get sorted movies (e.g., ?sortBy=rating)
router.get("/sorted", (movie_controller_1.getSortedMovies));
//  Search movies by title or description (e.g., ?query=Avengers)
router.get("/search", (movie_controller_1.searchMovies));
//  Add movie (Admin only)
router.post("/", auth_middleware_1.authenticateJWT, role_middleware_1.isAdmin, movie_controller_1.addMovie);
//  Edit movie details (Admin only)
router.put("/:id", auth_middleware_1.authenticateJWT, role_middleware_1.isAdmin, movie_controller_1.editMovie);
//  Delete movie (Admin only)
router.delete("/:id", auth_middleware_1.authenticateJWT, role_middleware_1.isAdmin, movie_controller_1.deleteMovie);
exports.default = router;
