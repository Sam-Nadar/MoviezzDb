import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import MovieCard from "../components/MovieCard";
import { BASE_URL } from "../App";

//  Define Type for Movie
export interface Movie {
  _id: string;
  title: string;
  rating: number;
  releaseDate: string;
  description: string;
  duration:number;
  genre: string;
}

const Home: React.FC = () => {
  //  Use `Movie[]` as the type for movies
  const [movies, setMovies] = useState<Movie[]>([]);
  const [sortBy, setSortBy] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //  Fetch Movies Based on Sorting & Pagination
  const fetchMovies = async (page: number, sortBy: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/movies/sorted?page=${page}&limit=6&sortBy=${sortBy}`
      );
      setMovies(response.data.movies); //  Now TypeScript recognizes `movies`
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("Failed to fetch movies");
    }
  };

  useEffect(() => {
    fetchMovies(currentPage, sortBy);
  }, [currentPage, sortBy]);

  return (
    <div className="container mx-auto p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center">MoviezzDb</h1>
      <p className="text-gray-600 text-center mt-2">
        The best place to find and review movies.
      </p>

      {/* Sorting Dropdown */}
      <div className="flex justify-center mt-6">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="title">Title</option>
          <option value="rating">Rating</option>
          <option value="duration">Duration</option>
        </select>
      </div>

      {/* Movie List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`px-4 py-2 mx-2 border rounded-md ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`px-4 py-2 mx-2 border rounded-md ${
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
