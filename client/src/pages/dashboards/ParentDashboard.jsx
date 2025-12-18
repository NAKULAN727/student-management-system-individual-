import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../context/AuthContext";
import {
  FaHome,
  FaUser,
  FaChartLine,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaComments,
  FaBell,
  FaSignOutAlt,
  FaChild,
  FaBars,
  FaGraduationCap,
} from "react-icons/fa";

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Child Profile", icon: <FaUser /> },
    { name: "Academic Report", icon: <FaChartLine /> },
    { name: "Attendance", icon: <FaCalendarAlt /> },
    { name: "Fee Payment", icon: <FaMoneyBillWave /> },
    { name: "Teacher Feedback", icon: <FaComments /> },
    { name: "Notifications", icon: <FaBell /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-row font-sans relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`w-72 bg-white shadow-xl flex flex-col fixed h-full z-20 transition-transform duration-300 border-r border-gray-100 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="p-8 border-b border-gray-100 flex items-center gap-4">
          <div className="bg-orange-600 w-10 h-10 rounded-xl shadow-lg flex items-center justify-center transform rotate-3 hover:rotate-0 transition-all duration-300">
            <FaGraduationCap className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              Eluria School
            </h1>
            <p className="text-sm text-gray-400 font-medium">Parent Portal</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-8 px-5 space-y-3 custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name);
                setIsSidebarOpen(false);
              }}
              className={`
                    w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 group
                    ${
                      activeTab === item.name
                        ? "bg-orange-50 text-orange-600 shadow-sm translate-x-1"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
            >
              <span
                className={`text-xl transition-colors ${
                  activeTab === item.name
                    ? "text-orange-600"
                    : "text-gray-400 group-hover:text-orange-400"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.name}</span>
              {activeTab === item.name && (
                <motion.div
                  layoutId="parentActiveIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-600"
                />
              )}
            </button>
          ))}
        </div>

        {/* User Profile & Logout (Bottom) */}
        <div className="p-5 border-t border-gray-100 bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 hover:shadow-inner transition-all duration-200 group"
          >
            <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 p-4 md:p-10 bg-gray-50/50 min-h-screen transition-all">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <FaBars className="text-2xl" />
          </button>
          <span className="font-bold text-gray-700">Eluria School</span>
          <div className="w-8"></div>
        </div>
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{activeTab}</h2>
            <p className="text-gray-500 mt-1">Monitor your child's progress.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-white shadow-sm text-gray-400 hover:text-orange-600 transition-colors">
              <FaBell />
            </button>
          </div>
        </header>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Content Container */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 min-h-[600px]">
            {/* Dynamic Content based on Active Tab */}
            {activeTab === "Dashboard" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <KPICard
                    title="Fees Due"
                    value="$500"
                    sub="Due by 30th Dec"
                    icon={<FaMoneyBillWave />}
                    color="bg-red-100 text-red-600"
                  />
                  <KPICard
                    title="Attendance"
                    value="92%"
                    sub="This Semester"
                    icon={<FaCalendarAlt />}
                    color="bg-green-100 text-green-600"
                  />
                  <KPICard
                    title="Latest Grade"
                    value="A"
                    sub="Mathematics"
                    icon={<FaChartLine />}
                    color="bg-blue-100 text-blue-600"
                  />
                </div>

                <div className="p-6 rounded-2xl border border-gray-100 bg-orange-50/50">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaChild className="text-orange-600" /> Child Overview
                  </h3>
                  {user.parentDetails?.linkedStudentId ? (
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-500">
                        <FaUser />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-800">
                          {user.parentDetails.linkedStudentId.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Admission No.{" "}
                          {
                            user.parentDetails.linkedStudentId.studentDetails
                              ?.admissionNumber
                          }
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No child linked. Please contact admin.
                    </p>
                  )}
                </div>
              </div>
            ) : activeTab === "Child Profile" ? (
              <div className="max-w-4xl mx-auto">
                {user.parentDetails?.linkedStudentId ? (
                  <div className="space-y-8">
                    {/* Header Card */}
                    <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm p-1 shadow-inner">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-6xl text-orange-500 overflow-hidden">
                            <FaUser />
                          </div>
                        </div>
                        <div className="text-center md:text-left">
                          <h2 className="text-3xl font-bold mb-2">
                            {user.parentDetails.linkedStudentId.name}
                          </h2>
                          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                              Student
                            </span>
                            <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                              Admission No:{" "}
                              {user.parentDetails.linkedStudentId.studentDetails
                                ?.admissionNumber || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Personal Info */}
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <FaUser />
                          </div>
                          Personal Information
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between py-3 border-b border-gray-50">
                            <span className="text-gray-500">Full Name</span>
                            <span className="font-semibold text-gray-700">
                              {user.parentDetails.linkedStudentId.name}
                            </span>
                          </div>
                          <div className="flex justify-between py-3 border-b border-gray-50">
                            <span className="text-gray-500">Email Address</span>
                            <span className="font-semibold text-gray-700">
                              {user.parentDetails.linkedStudentId.email}
                            </span>
                          </div>
                          <div className="flex justify-between py-3 border-b border-gray-50">
                            <span className="text-gray-500">Roll Number</span>
                            <span className="font-semibold text-gray-700">
                              {user.parentDetails.linkedStudentId.studentDetails
                                ?.rollNumber || "-"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Academic Info */}
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <FaChartLine />
                          </div>
                          Academic Details
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between py-3 border-b border-gray-50">
                            <span className="text-gray-500">Class</span>
                            <span className="font-semibold text-gray-700">
                              {user.parentDetails.linkedStudentId.studentDetails
                                ?.classId?.name
                                ? `${user.parentDetails.linkedStudentId.studentDetails.classId.name} - ${user.parentDetails.linkedStudentId.studentDetails.classId.section}`
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between py-3 border-b border-gray-50">
                            <span className="text-gray-500">Joined Date</span>
                            <span className="font-semibold text-gray-700">
                              {new Date(
                                user.parentDetails.linkedStudentId.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-4xl">
                      <FaChild />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700">
                      No Child Linked
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Please contact the school administration to link your
                      child's profile.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState item={menuItems.find((i) => i.name === activeTab)} />
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

const KPICard = ({ title, value, sub, icon, color }) => (
  <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
    <div>
      <p className="text-sm font-medium text-gray-500 group-hover:text-orange-600 transition-colors">
        {title}
      </p>
      <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}
    >
      {icon}
    </div>
  </div>
);

const EmptyState = ({ item }) => (
  <div className="flex flex-col items-center justify-center h-96 text-gray-400">
    <div className="text-6xl mb-4 opacity-20 bg-orange-50 p-8 rounded-full text-orange-600">
      {item?.icon}
    </div>
    <h3 className="text-xl font-bold text-gray-700 mb-1">{item?.name}</h3>
    <p className="text-sm">View {item?.name?.toLowerCase()} details here.</p>
  </div>
);

export default ParentDashboard;
