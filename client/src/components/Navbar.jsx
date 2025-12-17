import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaGraduationCap, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="flex justify-between items-center p-6 shadow-sm bg-white sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 z-50 relative">
        <FaGraduationCap className="text-4xl text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Eluria School
        </h1>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-8 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`font-medium transition-colors hover:text-blue-600 ${
              isActive(link.path) ? "text-blue-600" : "text-gray-600"
            }`}
          >
            {link.name}
          </Link>
        ))}
        <Link
          to="/login"
          className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
        >
          Login
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-2xl text-gray-600 z-50 relative focus:outline-none"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-2xl font-bold ${
                  isActive(link.path) ? "text-blue-600" : "text-gray-800"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="px-8 py-3 rounded-full bg-blue-600 text-white font-bold text-xl shadow-lg"
            >
              Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
