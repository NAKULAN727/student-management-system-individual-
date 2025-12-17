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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative">
      {/* Home Navigation */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium"
      >
        <FaArrowLeft /> Back to Home
      </Link>
      <ToastContainer />
      <div className="bg-white rounded-2xl shadow-2xl flex w-full max-w-4xl overflow-hidden min-h-[600px]">
        {/* Left Side: Role Selection & Visuals */}
        <div className="hidden md:flex flex-col w-1/2 bg-gradient-to-br from-primary to-blue-800 p-10 text-white justify-between relative">
          <div className="z-10">
            <h2 className="text-4xl font-bold mb-6">Welcome to Eluria</h2>
            <p className="text-blue-100">
              Select your role to continue to your dashboard.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 z-10">
            {roles.map((role) => (
              <div
                key={role.name}
                onClick={() => setSelectedRole(role.name)}
                className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                  selectedRole === role.name
                    ? "bg-white text-primary border-white"
                    : "bg-transparent border-blue-400/30 hover:bg-blue-700/50"
                }`}
              >
                <div className="text-3xl mb-2">{role.icon}</div>
                <span className="font-semibold">{role.name}</span>
              </div>
            ))}
          </div>

          {/* Decor */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
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
                <a
                  href="#"
                  className="text-sm text-primary hover:underline block"
                >
                  Forgot password?
                </a>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
