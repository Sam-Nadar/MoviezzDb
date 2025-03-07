import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { BASE_URL } from "../App";
import MovieCard from "../components/MovieCard";

//  Define Type for Movie
interface Movie {
  _id: string;
  title: string;
  description: string;
  rating: number;
  releaseDate: string;
  duration: number;
  genre: string;
}

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]); //  Ensure movies is always an array
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/movies/search?query=${searchQuery}`);

      //  Use response.data directly (since the API returns an array)
      setMovies(response.data);

      if (response.data.length === 0) {
        toast.error("No movies found!");
      }
    } catch (error) {
      toast.error("Failed to fetch movies");
      setMovies([]); //  Prevents undefined issues
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center">IMDb</h1>
      <p className="text-gray-600 text-center mt-2">
        The best place to find and review movies.
      </p>

      {/* Search Bar */}
      <div className="relative w-full max-w-md md:max-w-sm mx-auto mt-6 flex">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search Movies or TV Shows"
          className="w-full pl-10 pr-4 py-2 rounded-l-full bg-gray-900 text-white outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown} // Allow search on Enter key press
        />
        <button
          className="bg-indigo-500 px-4 rounded-r-full hover:bg-indigo-600 transition text-white"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Show Loading Message */}
      {loading && <p className="text-center text-gray-500 mt-4">Loading movies...</p>}

      {/* Search Results (Using MovieCard Component) */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie._id} movie={movie} />)
        ) : (
          !loading && <p className="text-center text-gray-500">No results found</p>
        )}
      </div>
    </div>
  );
};

export default Search;
