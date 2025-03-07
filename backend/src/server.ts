import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import movieRoutes from "./routes/movie.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { connectQueue } from "./utils/messageQueue";
import { processMovieQueue } from "./controllers/movie.controller";
import { ENV } from "./config/env";



const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to database and queue
connectDB();
connectQueue().then(() => processMovieQueue());


app.listen(ENV.PORT, () => console.log("Server running on port ", ENV.PORT));
