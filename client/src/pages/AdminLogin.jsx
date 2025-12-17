import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserShield, FaArrowLeft } from "react-icons/fa";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === "Admin") {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role !== "Admin") {
        toast.error("Access Denied. This portal is for Administrators only.");
        return;
      }
      toast.success(`Welcome back, Admin!`);
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative font-sans">
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium"
      >
        <FaArrowLeft /> Back to Home
      </Link>
      <ToastContainer position="top-right" theme="dark" />

      <div className="bg-gray-800 rounded-2xl shadow-2xl flex w-full max-w-4xl overflow-hidden min-h-[500px] border border-gray-700">
        {/* Left Side: Visuals */}
        <div className="hidden md:flex flex-col w-1/2 bg-gradient-to-br from-gray-900 to-blue-900 p-10 text-white justify-between relative">
          <div className="z-10">
            <h2 className="text-4xl font-bold mb-4">Admin Portal</h2>
            <p className="text-gray-300">
              Secure access for school administration and management.
            </p>
          </div>

          <div className="z-10 flex flex-col items-center justify-center flex-1">
            <div className="bg-white/10 p-6 rounded-full backdrop-blur-sm mb-4">
              <FaUserShield className="text-6xl text-blue-400" />
            </div>
            <p className="font-semibold text-blue-100">System Administrator</p>
          </div>

          <div className="text-xs text-gray-500 z-10">
            Authorized personnel only. All activities are monitored.
          </div>

          {/* Decor */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-900 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-gray-800 text-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-2">Admin Login</h3>
            <p className="text-gray-400 mb-8 text-sm">
              Please enter your admin credentials.
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                  placeholder="admin@eluria.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-blue-500/30 hover:bg-blue-500 transition-all transform hover:-translate-y-1"
              >
                Access Dashboard
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
