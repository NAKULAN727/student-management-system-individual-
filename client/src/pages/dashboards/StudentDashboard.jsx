import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import {
  FaHome,
  FaCalendarCheck,
  FaClipboardList,
  FaClock,
  FaBookOpen,
  FaCreditCard,
  FaBookReader,
  FaBullhorn,
  FaSignOutAlt,
  FaBars,
  FaGraduationCap,
} from "react-icons/fa";
import axios from "axios";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [announcements, setAnnouncements] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [timetable, setTimetable] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (activeTab === "Notices" && user) {
      const fetchAnnouncements = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const response = await axios.get(
            "http://localhost:5000/api/student/announcements",
            config
          );
          setAnnouncements(response.data);
        } catch (error) {
          console.error("Failed to fetch announcements", error);
        }
      };
      fetchAnnouncements();
    }

    if (activeTab === "Attendance" && user) {
      const fetchAttendance = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const response = await axios.get(
            "http://localhost:5000/api/student/attendance",
            config
          );
          setAttendanceHistory(response.data);
        } catch (error) {
          console.error("Failed to fetch attendance", error);
        }
      };
      fetchAttendance();
    }

    if (activeTab === "Time Table" && user) {
      const fetchTimetable = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const response = await axios.get(
            "http://localhost:5000/api/student/timetable",
            config
          );
          setTimetable(response.data);
        } catch (error) {
          console.error("Failed to fetch timetable", error);
        }
      };
      fetchTimetable();
    }
  }, [activeTab, user]);

  const menuItems = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Attendance", icon: <FaCalendarCheck /> },
    { name: "Report Card", icon: <FaClipboardList /> },
    { name: "Time Table", icon: <FaClock /> },
    { name: "Homework", icon: <FaBookOpen /> },

    { name: "Notices", icon: <FaBullhorn /> },
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
        className={`w-64 bg-white shadow-xl flex flex-col fixed h-full z-20 transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg shadow-lg">
            <FaGraduationCap className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">
              Eluria School
            </h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide">
              Student Portal
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name);
                setIsSidebarOpen(false);
              }}
              className={`
                                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                ${
                                  activeTab === item.name
                                    ? "bg-primary/10 text-primary shadow-sm translate-x-1"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }
                            `}
            >
              <span
                className={`text-lg ${
                  activeTab === item.name ? "text-primary" : "text-gray-400"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.name}</span>
              {activeTab === item.name && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </button>
          ))}
        </div>

        {/* Logout Button (Bottom) */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 hover:shadow-inner transition-all"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-gray-50/50 min-h-screen transition-all">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <FaBars className="text-2xl" />
          </button>
          <span className="font-bold text-gray-700">Student Portal</span>
          <div className="w-8"></div>
        </div>

        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome Back, {user?.name || "Student"}!
            </h2>
            <p className="text-gray-500">Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-4 hidden md:flex">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0) || "S"}
            </div>
          </div>
        </header>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Content Container */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[600px]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <span className="text-2xl text-primary p-2 bg-blue-50 rounded-lg">
                {menuItems.find((i) => i.name === activeTab)?.icon}
              </span>
              <h3 className="text-xl font-bold text-gray-800">{activeTab}</h3>
            </div>

            {/* Dynamic Content */}
            <div className="text-gray-600">
              {activeTab === "Dashboard" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <DashboardCard
                    title="Attendance"
                    value="95%"
                    color="bg-blue-50 text-blue-600"
                    borderColor="border-blue-100"
                  />
                  <DashboardCard
                    title="Next Class"
                    value="Mathematics"
                    sub="10:00 AM - Room 302"
                    color="bg-green-50 text-green-600"
                    borderColor="border-green-100"
                  />
                  <DashboardCard
                    title="Assignments"
                    value="3 Pending"
                    color="bg-purple-50 text-purple-600"
                    borderColor="border-purple-100"
                  />
                </div>
              ) : activeTab === "Notices" ? (
                <div className="space-y-6">
                  {announcements.length > 0 ? (
                    announcements.map((announcement) => (
                      <div
                        key={announcement._id}
                        className="bg-blue-50 border border-blue-100 p-6 rounded-2xl relative"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold text-gray-800">
                            {announcement.title}
                          </h4>
                          <span className="text-xs text-blue-500 font-medium bg-white px-2 py-1 rounded-md shadow-sm">
                            {new Date(
                              announcement.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {announcement.content}
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                          <span className="font-semibold text-gray-500">
                            Posted by:
                          </span>{" "}
                          {announcement.postedBy?.name || "Teacher"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <FaBullhorn className="text-4xl mx-auto mb-3 opacity-20" />
                      <p>No new notices at the moment.</p>
                    </div>
                  )}
                </div>
              ) : activeTab === "Attendance" ? (
                <div className="overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      My Attendance History
                    </h3>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="text-sm font-medium text-gray-600">
                          Present
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="text-sm font-medium text-gray-600">
                          Absent
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <table className="w-full text-left text-sm text-gray-600">
                      <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-xs">
                        <tr>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {attendanceHistory.length > 0 ? (
                          attendanceHistory.map((record) => (
                            <tr
                              key={record._id}
                              className="hover:bg-gray-50/50 transition-colors"
                            >
                              <td className="px-6 py-4 font-bold text-gray-800">
                                {new Date(record.date).toLocaleDateString(
                                  undefined,
                                  {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    record.status === "Present"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {record.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-500 italic">
                                {record.remarks || "-"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="3"
                              className="text-center py-8 text-gray-400"
                            >
                              No attendance records found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : activeTab === "Time Table" ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      Weekly Timetable
                    </h3>
                    <div className="text-sm text-gray-500 font-medium">
                      {timetable?._id
                        ? "Class Schedule"
                        : "No schedule available"}
                    </div>
                  </div>

                  {timetable && timetable.schedule ? (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto shadow-sm">
                      <table className="w-full text-left text-sm text-gray-600 min-w-[800px]">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-xs">
                          <tr>
                            <th className="px-6 py-4 border-b border-gray-200 sticky left-0 bg-gray-50 z-10 w-24">
                              Day
                            </th>
                            {Array.from({ length: 6 }).map((_, i) => (
                              <th
                                key={i}
                                className="px-4 py-4 text-center border-b border-gray-200 min-w-[100px]"
                              >
                                Period {i + 1}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                          ].map((day) => (
                            <tr key={day} className="hover:bg-gray-50/50">
                              <td className="px-6 py-4 font-bold text-gray-800 bg-white sticky left-0 border-r border-gray-100">
                                {day}
                              </td>
                              {Array.from({ length: 6 }).map((_, i) => {
                                const period = timetable.schedule[day]?.find(
                                  (p) => p.period === i + 1
                                );
                                return (
                                  <td
                                    key={i}
                                    className="px-4 py-4 text-center border-r border-dashed border-gray-100 last:border-0"
                                  >
                                    {period ? (
                                      <div className="flex flex-col items-center">
                                        <span className="font-bold text-primary">
                                          {period.subject}
                                        </span>
                                        <span className="text-[10px] text-gray-400 mt-1 font-medium bg-gray-100 px-1.5 py-0.5 rounded">
                                          {period.startTime} - {period.endTime}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-gray-300">-</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <FaClock className="text-4xl mx-auto mb-3 opacity-20" />
                      <p>Timetable has not been uploaded yet.</p>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState
                  item={menuItems.find((i) => i.name === activeTab)}
                />
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

const DashboardCard = ({ title, value, sub, color, borderColor }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`p-6 rounded-2xl border ${borderColor} ${color} bg-opacity-50`}
  >
    <h4 className="font-semibold opacity-80">{title}</h4>
    <p className="text-2xl font-bold mt-2">{value}</p>
    {sub && <p className="text-sm opacity-70 mt-1">{sub}</p>}
  </motion.div>
);

const EmptyState = ({ item }) => (
  <div className="flex flex-col items-center justify-center h-96 text-gray-400">
    <div className="text-7xl mb-6 opacity-20 bg-gray-100 p-6 rounded-full">
      {item?.icon}
    </div>
    <p className="text-lg">
      Section for{" "}
      <span className="font-semibold text-gray-600">{item?.name}</span>
    </p>
  </div>
);

export default StudentDashboard;
