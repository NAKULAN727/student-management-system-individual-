import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthContext from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserTie,
  FaUserShield,
  FaArrowLeft,
} from "react-icons/fa";
import axios from "axios";
import bgAuth from "../assets/bg_auth_school.png";

const roles = [
  { name: "Student", icon: <FaUserGraduate />, color: "bg-blue-500" },
  { name: "Teacher", icon: <FaChalkboardTeacher />, color: "bg-green-500" },
  { name: "Parent", icon: <FaUserTie />, color: "bg-purple-500" },
];

const Login = () => {
  const [selectedRole, setSelectedRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email: resetEmail,
      });
      toast.success("Password reset request sent to Admin.");
      setShowForgotModal(false);
      setResetEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role !== selectedRole) {
        toast.error(`Please login via the ${user.role} portal.`);
        return;
      }
      toast.success(`Welcome back, ${user.name}!`);
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Home Navigation */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium z-10"
      >
        <FaArrowLeft /> Back to Home
      </Link>
      <ToastContainer />
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex w-full max-w-4xl overflow-hidden min-h-[600px] relative z-10">
        {/* Left Side: Role Selection & Visuals */}
        <div className="hidden md:flex flex-col w-1/2 p-10 text-white justify-between relative overflow-hidden">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={bgAuth}
              alt="School Hallway"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-[2px]"></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">Welcome to Eluria</h2>
            <p className="text-blue-100">
              Select your role to continue to your dashboard.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            {roles.map((role) => (
              <div
                key={role.name}
                onClick={() => setSelectedRole(role.name)}
                className={`p-4 rounded-xl cursor-pointer transition-all border-2 backdrop-blur-md ${
                  selectedRole === role.name
                    ? "bg-white/10 border-white text-white"
                    : "bg-transparent border-white/20 hover:bg-white/5 text-gray-200"
                }`}
              >
                <div className="text-3xl mb-2">{role.icon}</div>
                <span className="font-semibold">{role.name}</span>
              </div>
            ))}
          </div>

          <div className="relative z-10 text-xs text-blue-200/60 mt-8">
            Eluria School Management System &copy; 2025
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="md:hidden flex justify-around mb-8">
            {roles.map((role) => (
              <div
                key={role.name}
                onClick={() => setSelectedRole(role.name)}
                className={`p-2 rounded-lg cursor-pointer ${
                  selectedRole === role.name
                    ? "bg-blue-100 text-primary"
                    : "text-gray-400"
                }`}
              >
                <div className="text-2xl">{role.icon}</div>
              </div>
            ))}
          </div>

          <motion.div
            key={selectedRole}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              {selectedRole} Login
            </h3>
            <p className="text-gray-500 mb-8">
              Enter your credentials to access your account.
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="name@eluria.edu" // Fixed typo in email example
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all transform hover:-translate-y-1"
              >
                Sign In as {selectedRole}
              </button>

              <div className="text-center mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-primary hover:underline block mx-auto"
                >
                  Forgot password?
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-8 relative"
            >
              <button
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                &times;
              </button>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Reset Password
              </h3>
              <p className="text-gray-500 mb-6">
                Enter your email address to request a password reset from the
                admin.
              </p>
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="name@eluria.edu"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-70"
                  >
                    {resetLoading ? "Sending..." : "Send Request"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
