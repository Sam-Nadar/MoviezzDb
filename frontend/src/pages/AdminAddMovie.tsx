import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../App";

//  Format Date to "07 Mar 2025"
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-GB", options);
};

const AdminAddMovie: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    releaseDate: "",
    duration: "",
    genre: "",
    rating: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;

    //  Format Genre: Remove extra spaces after commas
    if (name === "genre") {
      value = value.replace(/\s*,\s*/g, ",");
    }

    //  Ensure rating is between 0-10 (allowing decimals)
    if (name === "rating") {
      if (!/^\d*\.?\d*$/.test(value)) return; // Allow only numbers and decimals
      const num = parseFloat(value);
      if (num > 10) value = "10";
      if (num < 0) value = "0";
    }

    setFormData({ ...formData, [name]: value });
  };

  //  Handle Date Change and Format Before Storing
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    const formattedDate = formatDate(date.toISOString());
    setFormData({ ...formData, releaseDate: formattedDate });
  };

  //  Handle Form Submission
  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.releaseDate || !formData.duration || !formData.genre || !formData.rating) {
      toast.error("All fields are required!");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/movies`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Movie added successfully!");
      setFormData({ title: "", description: "", releaseDate: "", duration: "", genre: "", rating: "" }); // Reset Form
    } catch (error) {
      toast.error("Failed to add movie");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-black text-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center mb-4">Add Movie</h2>

        {/* Title */}
        <label className="block text-gray-400 font-semibold">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-3"
        />

        {/* Description */}
        <label className="block text-gray-400 font-semibold">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-3"
        />

        {/* Release Date Picker */}
        <label className="block text-gray-400 font-semibold">Release Date</label>
        <input
          type="date"
          name="releaseDate"
          onChange={handleDateChange}
          className="w-full p-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-3"
        />

        {/* Duration */}
        <label className="block text-gray-400 font-semibold">Duration (in mins)</label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full p-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-3"
        />

        {/* Genre */}
        <label className="block text-gray-400 font-semibold">Genre</label>
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          className="w-full p-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-3"
          placeholder="e.g., Adventure,Sci-Fi,Action"
        />

        {/* Rating */}
        <label className="block text-gray-400 font-semibold">Rating (0-10)</label>
        <input
          type="text"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          className="w-full p-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-3"
          placeholder="e.g., 8.5"
        />

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button className="bg-gray-500 px-4 py-2 rounded-md text-white" onClick={() => setFormData({ title: "", description: "", releaseDate: "", duration: "", genre: "", rating: "" })}>
            Reset
          </button>
          <button className="bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700 transition" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddMovie;
