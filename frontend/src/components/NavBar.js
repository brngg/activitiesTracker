import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">My Adventure List</Link>
        <div>
          <Link to="/" className="text-white mr-4 hover:text-indigo-200">Home</Link>
          <Link to="/dashboard" className="text-white hover:text-indigo-200">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
