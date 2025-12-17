import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserTie, FaChalkboardTeacher, FaUsers } from "react-icons/fa";
import Navbar from "../components/Navbar";
import schoolImage from "../assets/school1.webp";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <header className="flex-1 flex flex-col md:flex-row items-center justify-center p-10 gap-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 space-y-6"
        >
          <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
            Excellence in <br /> <span className="text-primary">Education</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-lg">
            Empowering the next generation with world-class education and
            state-of-the-art management systems.
          </p>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-8 py-3 rounded-xl bg-primary text-white font-bold text-lg shadow-xl hover:scale-105 transition-transform"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="px-8 py-3 rounded-xl border-2 border-primary text-primary font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 relative"
        >
          {/* Hero Image */}
          <div className="w-full h-96 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-blue-900/10 z-10"></div>
            <img
              src={schoolImage}
              alt="Eluria School Campus"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </div>
        </motion.div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-10 bg-white">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-800">Our Portals</h3>
          <p className="text-gray-500 mt-2">
            Dedicated dashboards for every role
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <FeatureCard
            icon={<FaUserTie />}
            title="Student Portal"
            desc="Access results, attendance, and study materials."
          />
          <FeatureCard
            icon={<FaChalkboardTeacher />}
            title="Teacher Portal"
            desc="Manage classes, grade students, and connect with parents."
          />
          <FeatureCard
            icon={<FaUsers />}
            title="Parent Portal"
            desc="Track your child's progress and stay updated."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 text-center">
        <p>&copy; 2025 Eluria School of Excellence. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all"
  >
    <div className="text-4xl text-primary mb-4">{icon}</div>
    <h4 className="text-xl font-bold mb-2">{title}</h4>
    <p className="text-gray-500">{desc}</p>
  </motion.div>
);

export default Landing;
