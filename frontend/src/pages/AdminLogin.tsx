import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../App";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on input change
  };

  const handleLogin = async () => {
    //  Validate Empty Fields
    const newErrors = { email: "", password: "" };
    if (!formData.email) newErrors.email = "Email is required!";
    if (!formData.password) newErrors.password = "Password is required!";
    
    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return; // Stop function execution if there are errors
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/admin-login`, formData);
      toast.success("Admin Login Successful!");
      localStorage.setItem("token", response.data.token);
      navigate("/admin/adminHome"); // Redirect to admin home page
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-black text-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center mb-4">Admin Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 mt-3"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 mt-3"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white font-semibold py-3 mt-4 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
