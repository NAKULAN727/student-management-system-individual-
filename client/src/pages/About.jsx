import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaQuoteLeft,
  FaBookOpen,
  FaHandHoldingHeart,
  FaLightbulb,
  FaUserTie,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

const About = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">About Us</h1>
          <p className="text-xl md:text-2xl font-light text-blue-100 max-w-3xl mx-auto">
            Eluria School of Excellence
          </p>
        </motion.div>
      </section>

      {/* Who We Are */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="bg-blue-50 p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 text-9xl text-blue-100 opacity-50 -mr-10 -mt-10">
              <FaGraduationCap />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 relative z-10">
              Who We Are
            </h2>
            <p className="text-gray-600 leading-relaxed relative z-10">
              Eluria School of Excellence is a premier educational institution
              committed to nurturing young minds through academic excellence,
              character development, and innovation. We believe education is not
              just about knowledge, but about shaping responsible, confident,
              and future-ready individuals.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4 relative z-10">
              Our school provides a safe, inclusive, and stimulating environment
              where students are encouraged to explore their potential and grow
              holistically.
            </p>
          </div>
          <div className="space-y-8">
            {/* Mission */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xl flex-shrink-0">
                <FaBookOpen />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Our Mission
                </h3>
                <p className="text-gray-600">
                  To deliver quality education that empowers students with
                  knowledge, skills, values, and creativity, enabling them to
                  excel academically and contribute positively to society.
                </p>
              </div>
            </div>
            {/* Vision */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xl flex-shrink-0">
                <FaLightbulb />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Our Vision
                </h3>
                <p className="text-gray-600">
                  To be a center of excellence in education, inspiring lifelong
                  learning, leadership, integrity, and innovation in every
                  student.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Leadership */}
      <section className="py-16 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Leadership
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <LeadershipCard
              name="Dr. Amelia Hart"
              role="Principal"
              desc="A visionary educator with over 20 years of experience in academic leadership and student development."
            />
            <LeadershipCard
              name="Mr. Jonathan Reed"
              role="Vice Principal"
              desc="Dedicated to fostering discipline, academic excellence, and a supportive learning environment."
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">
          Our Core Values
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <ValueCard title="Academic Excellence" color="bg-blue-500" />
          <ValueCard title="Integrity & Discipline" color="bg-green-500" />
          <ValueCard title="Innovation & Creativity" color="bg-purple-500" />
          <ValueCard title="Inclusiveness & Respect" color="bg-orange-500" />
          <ValueCard title="Student-Centered Learning" color="bg-red-500" />
        </div>
      </section>
    </div>
  );
};

const LeadershipCard = ({ name, role, desc }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-blue-600 flex gap-6 items-start"
  >
    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-3xl text-gray-400 flex-shrink-0">
      <FaUserTie />
    </div>
    <div>
      <h3 className="text-xl font-bold text-gray-900">{name}</h3>
      <span className="text-blue-600 font-semibold text-sm mb-2 block">
        {role}
      </span>
      <p className="text-gray-500 italic text-sm">
        <FaQuoteLeft className="inline text-gray-300 mr-2" />
        {desc}
      </p>
    </div>
  </motion.div>
);

const ValueCard = ({ title, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`p-6 rounded-xl ${color} text-white shadow-lg flex items-center justify-center min-h-[120px]`}
  >
    <h4 className="font-bold text-lg leading-tight">{title}</h4>
  </motion.div>
);

export default About;
