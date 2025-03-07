import React from "react";

export interface MovieProps {
  movie: {
    _id: string;
    title: string;
    rating: number;
    releaseDate: string;
    description: string;
    duration:number;
    genre:string;
  };
}

const MovieCard: React.FC<MovieProps> = ({ movie }) => {
  return (
    <div className="relative bg-white shadow-md rounded-lg p-4 border border-gray-200 overflow-hidden">
      {/* Rating in Top-Left Corner */}
      <div className="absolute top-2 left-2 bg-black text-yellow-400 px-3 py-1 rounded-md text-sm font-bold">
        ★ {movie.rating}
      </div>

      {/* Movie Details */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-900">{movie.title}</h2>
        <p className="text-gray-600 text-sm mt-1">{new Date(movie.releaseDate).toDateString()}</p>
        <p className="text-gray-700 mt-2">{movie.description}</p>
        <p className="text-black-700 mt-2">Genre: {movie.genre}</p>
        <p className="text-black-700 mt-2">{movie.duration} mins</p>
      </div>
    </div>
  );
};

export default MovieCard;
