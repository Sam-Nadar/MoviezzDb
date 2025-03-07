import React from "react";
import { Link } from "react-router-dom";

const UserNavbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">MoviezzDb</h1>
      <div>
        <Link to="/home" className="mr-4 hover:text-gray-400">Home</Link>
        <Link to="/search" className="hover:text-gray-400">Search</Link>
      </div>
    </nav>
  );
};

export default UserNavbar;
