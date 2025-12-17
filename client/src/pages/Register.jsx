import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUserGraduate,
  FaUserTie,
  FaArrowLeft,
  FaChalkboardTeacher,
} from "react-icons/fa";
import axios from "axios";

const roles = [
  { name: "Student", icon: <FaUserGraduate />, color: "bg-blue-500" },
  { name: "Parent", icon: <FaUserTie />, color: "bg-purple-500" },
  { name: "Teacher", icon: <FaChalkboardTeacher />, color: "bg-green-500" },
];

const Register = () => {
  const [selectedRole, setSelectedRole] = useState("Student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [linkedStudentAdmissionNumber, setLinkedStudentAdmissionNumber] =
    useState("");
  // const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = {
        name,
        email,
        password,
        role: selectedRole,
        linkedStudentAdmissionNumber:
          selectedRole === "Parent" ? linkedStudentAdmissionNumber : undefined,
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        body,
        config
      );

      toast.success("Registration successful!");

      // If Student, show their Admission Number
      if (selectedRole === "Student" && data.admissionNumber) {
        toast.info(`Your Admission Number is: ${data.admissionNumber}`, {
          autoClose: false,
        });
      }

      // Optional: Auto login or redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative">
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
            <h2 className="text-4xl font-bold mb-6">Join Eluria</h2>
            <p className="text-blue-100">Create an account to get started.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 z-10">
            {roles.map((role) => (
              <div
                key={role.name}
                onClick={() => setSelectedRole(role.name)}
                className={`p-4 rounded-xl cursor-pointer transition-all border-2 flex items-center gap-4 ${
                  selectedRole === role.name
                    ? "bg-white text-primary border-white"
                    : "bg-transparent border-blue-400/30 hover:bg-blue-700/50"
                }`}
              >
                <div className="text-2xl">{role.icon}</div>
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
          <motion.div
            key={selectedRole}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              {selectedRole} Registration
            </h3>
            <p className="text-gray-500 mb-8">
              Fill in your details to create an account.
            </p>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="name@example.com"
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

              {selectedRole === "Parent" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Admission Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="ELU-STU-XXXX"
                    value={linkedStudentAdmissionNumber}
                    onChange={(e) =>
                      setLinkedStudentAdmissionNumber(e.target.value)
                    }
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Enter the admission number provided to your child.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all transform hover:-translate-y-1 mt-4"
              >
                Register as {selectedRole}
              </button>

              <div className="text-center mt-4">
                <span className="text-gray-600 text-sm">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login"
                  className="text-sm text-primary font-bold hover:underline"
                >
                  Login here
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
