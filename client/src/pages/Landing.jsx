import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserTie,
  FaChalkboardTeacher,
  FaUsers,
  FaBullhorn,
  FaTimes,
  FaCalendarAlt,
  FaArrowRight,
  FaUserGraduate,
  FaUserShield,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import schoolImage from "../assets/school1.webp";
import axios from "axios";
import { useState, useEffect } from "react";

const Landing = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/announcements"
        );
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Failed to fetch public announcements", error);
      }
    };
    fetchAnnouncements();
  }, []);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
          <FeatureCard
            icon={<FaUserGraduate />}
            title="Student Portal"
            desc="Access results, attendance, and study materials."
          />
          <FeatureCard
            icon={<FaChalkboardTeacher />}
            title="Teacher Portal"
            desc="Manage classes, grade students, and connect with parents."
          />
          <FeatureCard
            icon={<FaUserTie />}
            title="Parent Portal"
            desc="Track your child's progress and stay updated."
          />
          <FeatureCard
            icon={<FaUserShield />}
            title="Admin Portal"
            desc="Oversee the entire school management system."
          />
        </div>
      </section>

      {/* Latest Announcements Section */}
      {announcements.length > 0 && (
        <section className="py-24 px-6 md:px-12 bg-gray-50 relative overflow-hidden">
          {/* Abstract Shapes Background */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

          <div className="text-center mb-20 relative z-10">
            <span className="text-blue-800 font-bold tracking-wider uppercase text-sm bg-blue-50 px-4 py-1.5 rounded-full inline-block mb-4">
              School Updates
            </span>
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Latest <span className="text-blue-600">Announcements</span>
            </h3>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
              Keep up with the latest news, events, and important circulars from
              Eluria School.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group h-full"
              >
                <div className="bg-white rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col overflow-hidden border border-gray-100">
                  {/* Colored Header Card Style */}
                  <div
                    className={`p-6 ${
                      index % 2 === 0
                        ? "bg-gradient-to-br from-slate-800 to-slate-700"
                        : "bg-gradient-to-br from-blue-900 to-blue-800"
                    } relative overflow-hidden`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-5 rounded-full -ml-10 -mb-10 blur-lg"></div>

                    <div className="flex justify-between items-start relative z-10">
                      <div className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/30 flex items-center gap-2">
                        <FaCalendarAlt />
                        {new Date(announcement.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <span className="bg-white text-gray-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                        NOTICE
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-white mt-4 leading-tight line-clamp-2">
                      {announcement.title}
                    </h4>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index % 2 === 0
                            ? "bg-slate-100 text-slate-700"
                            : "bg-blue-50 text-blue-900"
                        }`}
                      >
                        {announcement.postedBy?.name?.[0] || "A"}
                      </div>
                      <div className="text-xs">
                        <p className="text-gray-400">Published by</p>
                        <p className="font-bold text-gray-700">
                          {announcement.postedBy?.name || "Admin"}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                      {announcement.content}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedAnnouncement(announcement)}
                        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                          index % 2 === 0
                            ? "bg-slate-50 text-slate-700 hover:bg-slate-100"
                            : "bg-blue-50 text-blue-800 hover:bg-blue-100"
                        }`}
                      >
                        Read Full Notice <FaArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 text-center">
        <p>&copy; 2025 Eluria School of Excellence. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-6 text-sm text-gray-400">
          <Link
            to="/privacy-policy"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-and-conditions"
            className="hover:text-white transition-colors"
          >
            Terms & Conditions
          </Link>
        </div>
      </footer>

      {/* Announcement Modal */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAnnouncement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto relative overflow-hidden ring-1 ring-black/5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-900 to-slate-800 p-8 text-white relative">
                <div className="absolute top-0 right-0 p-6">
                  <button
                    onClick={() => setSelectedAnnouncement(null)}
                    className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full p-2 transition-all"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-500/30 backdrop-blur-sm border border-blue-400/30 text-blue-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Notice
                  </span>
                  <span className="text-blue-200 text-sm font-medium flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-300" />
                    {new Date(
                      selectedAnnouncement.createdAt
                    ).toLocaleDateString(undefined, { dateStyle: "long" })}
                  </span>
                </div>
                <h3 className="text-3xl font-bold leading-tight">
                  {selectedAnnouncement.title}
                </h3>
              </div>

              <div className="p-8">
                <div className="prose prose-slate prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {selectedAnnouncement.content}
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                      {selectedAnnouncement.postedBy?.name?.[0] || "A"}
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-500">Published by</p>
                      <p className="font-bold text-gray-800">
                        {selectedAnnouncement.postedBy?.name || "Admin"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAnnouncement(null)}
                    className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
