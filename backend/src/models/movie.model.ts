import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
    title: String,
    description: String,
    rating: Number,
    releaseDate: String,
    duration: Number,
    genre:String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Movie", MovieSchema);
