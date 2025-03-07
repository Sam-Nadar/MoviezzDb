import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserNavbar from "./components/UserNavbar";
import AdminNavbar from "./components/AdminNavbar";
import Home from "./pages/UserHome";
import AdminHome from "./pages/AdminHome";
import AdminAddMovie from "./pages/AdminAddMovie";
import Register from "./pages/Register";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import Search from "./pages/Search";

export const BASE_URL = import.meta.env.VITE_BASE_URI;

const App: React.FC = () => {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Auth Routes (No Navbar) */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* User Routes (With Navbar) */}
        <Route
          path="/*"
          element={
            <>
              <UserNavbar />
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/search" element={<Search />} />
              </Routes>
            </>
          }
        />

        {/* Admin Routes (With Navbar) */}
        <Route
          path="/admin/*"
          element={
            <>
              <AdminNavbar />
              <Routes>
                <Route path="/adminHome" element={<AdminHome />} />
                <Route path="/admin-addMovie" element={<AdminAddMovie />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
