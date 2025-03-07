import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import MovieCard from "../components/MovieCard";
import { BASE_URL } from "../App";
import EditMovieModal from "../components/EditMovieModal";

//  Define Type for Movie
export interface Movie {
  _id: string;
  title: string;
  rating: number;
  releaseDate: string;
  description: string;
  genre: string;
  duration: number;
}

const AdminHome: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [sortBy, setSortBy] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showModal, setShowModal] = useState(false);

  //  Fetch Movies
  const fetchMovies = async (page: number, sortBy: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/movies/sorted?page=${page}&limit=6&sortBy=${sortBy}`
      );
      setMovies(response.data.movies);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("Failed to fetch movies");
    }
  };

  useEffect(() => {
    fetchMovies(currentPage, sortBy);
  }, [currentPage, sortBy]);

  //  Handle Delete Movie
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/movies/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Movie deleted successfully!");
      fetchMovies(currentPage, sortBy); // Refresh movies list
    } catch (error) {
      toast.error("Failed to delete movie");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center">Admin Dashboard</h1>
      <p className="text-gray-600 text-center mt-2">
        Manage your movies efficiently.
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

      {/* Movie List with Edit & Delete Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {movies.map((movie) => (
          <div key={movie._id} className="relative">
            <MovieCard movie={movie} />
            <div className="flex justify-start space-x-3 mt-2 ml-2">
              <button
                className="bg-yellow-500 px-4 py-2 rounded-md text-white hover:bg-yellow-600 transition w-20"
                onClick={() => {
                  setSelectedMovie(movie);
                  setShowModal(true);
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 px-4 py-2 rounded-md text-white hover:bg-red-600 transition w-20"
                onClick={() => handleDelete(movie._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`px-4 py-2 mx-2 border rounded-md ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`px-4 py-2 mx-2 border rounded-md ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>

      {/* Edit Movie Modal */}
      {showModal && selectedMovie && (
        <EditMovieModal
          movie={selectedMovie}
          onClose={() => setShowModal(false)}
          onUpdate={() => fetchMovies(currentPage, sortBy)}
        />
      )}
    </div>
  );
};

export default AdminHome;
