import React from "react";
import { Link } from "react-router-dom";

const AdminNavbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">MoviezzDb Admin</h1>
      <div>
        <Link to="/admin/adminHome" className="mr-4 hover:text-gray-400">Home</Link>
        <Link to="/admin/admin-addMovie" className="hover:text-gray-400">Add Movie</Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;
