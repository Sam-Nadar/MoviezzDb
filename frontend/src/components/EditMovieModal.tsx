import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../App";
import { Movie } from "../pages/AdminHome";

//  Format Date to "07 Mar 2025"
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-GB", options);
};

interface EditMovieModalProps {
  movie: Movie;
  onClose: () => void;
  onUpdate: () => void;
}

const EditMovieModal: React.FC<EditMovieModalProps> = ({ movie, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ 
    ...movie, 
    releaseDate: formatDate(movie.releaseDate) 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    const formattedDate = formatDate(date.toISOString());
    setFormData({ ...formData, releaseDate: formattedDate });
  };

  const handleSubmit = async () => {
    if (JSON.stringify(formData) === JSON.stringify({ ...movie, releaseDate: formatDate(movie.releaseDate) })) {
      toast.error("At least one field must be updated!");
      return;
    }

    try {
      await axios.put(`${BASE_URL}/movies/${movie._id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Movie updated successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to update movie");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Movie</h2>

        {/* Title */}
        <label className="block text-gray-700 font-semibold">Title</label>
        <input 
          type="text" 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          className="w-full p-2 border rounded-md mb-3"
        />

        {/* Description */}
        <label className="block text-gray-700 font-semibold">Description</label>
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          className="w-full p-2 border rounded-md mb-3"
        />

        {/* Release Date Picker */}
        <label className="block text-gray-700 font-semibold">Release Date</label>
        <input 
          type="date" 
          name="releaseDate" 
          onChange={handleDateChange} 
          className="w-full p-2 border rounded-md mb-3"
        />

        {/* Genre */}
        <label className="block text-gray-700 font-semibold">Genre</label>
        <input 
          type="text" 
          name="genre" 
          value={formData.genre} 
          onChange={handleChange} 
          className="w-full p-2 border rounded-md mb-3"
        />

        {/* Duration */}
        <label className="block text-gray-700 font-semibold">Duration (minutes)</label>
        <input 
          type="number" 
          name="duration" 
          value={formData.duration} 
          onChange={handleChange} 
          className="w-full p-2 border rounded-md mb-3"
        />

        <div className="flex justify-end">
          <button className="bg-gray-500 px-4 py-2 rounded-md text-white mr-2" onClick={onClose}>Cancel</button>
          <button className="bg-blue-600 px-4 py-2 rounded-md text-white" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default EditMovieModal;
