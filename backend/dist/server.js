"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const movie_routes_1 = __importDefault(require("./routes/movie.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const messageQueue_1 = require("./utils/messageQueue");
const movie_controller_1 = require("./controllers/movie.controller");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/movies", movie_routes_1.default);
// Error handling middleware
app.use(error_middleware_1.errorHandler);
// Connect to database and queue
(0, db_1.default)();
(0, messageQueue_1.connectQueue)().then(() => (0, movie_controller_1.processMovieQueue)());
app.listen(env_1.ENV.PORT, () => console.log("Server running on port ", env_1.ENV.PORT));
