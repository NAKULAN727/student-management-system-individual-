import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Navbar from "../components/Navbar";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Check if backend routes exist, otherwise just simulate
      await axios.post("http://localhost:5000/api/feedback", formData);
      toast.success("Feedback sent successfully! Thank you.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      // If the endpoint doesn't exist yet, we still show success to the user in this demo if it's a 404
      // But ideally we should catch real errors. user asked for "Data stored..." so I will implement backend.
      if (error.response?.status === 404) {
        toast.error("Feedback service unavailable currently.");
      } else {
        toast.error("Failed to send feedback. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <ToastContainer position="top-right" />

      <Navbar />

      {/* Header */}
      <section className="text-center py-10 px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Get in Touch</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          We would love to hear from you! Whether you have questions, feedback,
          or inquiries, feel free to reach out.
        </p>
      </section>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 pb-20">
        {/* Contact Info */}
        <div className="space-y-8">
          <ContactInfoCard
            icon={<FaEnvelope />}
            title="Email Us"
            content="eluria@edu.com"
            color="bg-blue-100 text-blue-600"
          />
          <ContactInfoCard
            icon={<FaPhoneAlt />}
            title="Call Us"
            content="+144 199 244"
            color="bg-green-100 text-green-600"
          />
          <ContactInfoCard
            icon={<FaMapMarkerAlt />}
            title="Visit Us"
            content={
              <>
                Eluria School of Excellence
                <br />
                Knowledge Avenue,
                <br />
                Future City, Education District
              </>
            }
            color="bg-purple-100 text-purple-600"
          />

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-2">
              Message to Visitors
            </h4>
            <p className="text-gray-600 text-sm italic">
              "Your feedback helps us grow and improve. At Eluria School of
              Excellence, we value communication and collaboration with our
              school community."
            </p>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaPaperPlane className="text-blue-600" /> Feedback Form
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="What is this about?"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message / Feedback
              </label>
              <textarea
                rows="4"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-70"
            >
              {loading ? "Sending..." : "Submit Feedback"}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ContactInfoCard = ({ icon, title, content, color }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${color}`}
    >
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-gray-800 text-lg">{title}</h4>
      <p className="text-gray-600 font-medium">{content}</p>
    </div>
  </div>
);

export default Contact;
