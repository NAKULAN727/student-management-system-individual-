import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import {
  FaHome,
  FaChalkboardTeacher,
  FaCheckSquare,
  FaEdit,
  FaBullhorn,
  FaSignOutAlt,
  FaSchool,
  FaBars,
  FaGraduationCap,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, user } = useContext(AuthContext);
  const [teacherData, setTeacherData] = useState(null);
  const [selectedClassForMarks, setSelectedClassForMarks] = useState(null);
  const [selectedClassForAttendance, setSelectedClassForAttendance] =
    useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [attendanceState, setAttendanceState] = useState({});
  const [marksState, setMarksState] = useState({});
  const [maxMarks, setMaxMarks] = useState(100);
  const [announcementData, setAnnouncementData] = useState({
    title: "",
    content: "",
    audience: ["Student"], // Default audience
    classId: "",
  });

  const fetchClassStudents = async (classId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const studentsResponse = await axios.get(
        `http://localhost:5000/api/teacher/classes/${classId}/students`,
        config
      );
      const studentsData = studentsResponse.data;
      setClassStudents(studentsData);

      // Fetch existing marks
      const marksResponse = await axios.get(
        `http://localhost:5000/api/teacher/classes/${classId}/marks?examType=Term 1`,
        config
      );
      const gradesData = marksResponse.data;

      // Identify the subject this teacher teaches for this class
      // Need to find the class object first to get the subject
      const assignedClass = teacherData?.teacherDetails?.assignedClasses?.find(
        (c) => c._id === classId
      );

      let mySubjectName = "";
      if (assignedClass) {
        const subjectObj = assignedClass.subjects.find(
          (s) => s.teacher === user._id
        );
        if (subjectObj && subjectObj.subject) {
          mySubjectName = subjectObj.subject.name;
        }
      }

      // Initialize attendance state (default Present)
      const initialAttendance = {};
      const initialMarks = {};
      let fetchedMaxMarks = 100;

      studentsData.forEach((student) => {
        initialAttendance[student._id] = { status: "Present", remarks: "" };
        initialMarks[student._id] = "";

        // Find grade for this student
        const grade = gradesData.find((g) => g.studentId === student._id);
        if (grade && mySubjectName) {
          const subjectGrade = grade.subjects.find(
            (s) => s.name === mySubjectName
          );
          if (subjectGrade) {
            initialMarks[student._id] = subjectGrade.score;
            fetchedMaxMarks = subjectGrade.total || 100;
          }
        }
      });
      setAttendanceState(initialAttendance);
      setMarksState(initialMarks);
      setMaxMarks(fetchedMaxMarks);
    } catch (error) {
      console.error("Failed to fetch students or marks", error);
    }
  };

  const handleSaveAttendance = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = {
        classId: selectedClassForAttendance._id,
        date: new Date().toISOString().split("T")[0],
        attendanceData: Object.entries(attendanceState).map(
          ([studentId, data]) => ({
            studentId,
            status: data.status,
            remarks: data.remarks,
          })
        ),
      };

      await axios.post(
        "http://localhost:5000/api/teacher/attendance",
        payload,
        config
      );
      toast.success("Attendance saved successfully!");
    } catch (error) {
      toast.error("Failed to save attendance");
      console.error(error);
    }
  };

  const handleSaveMarks = async () => {
    try {
      // Find the subject this teacher teaches for this class
      const assignedClass = teacherData.teacherDetails.assignedClasses.find(
        (c) => c._id === selectedClassForMarks._id
      );
      const mySubject = assignedClass.subjects.find(
        (s) => s.teacher === user._id
      );

      if (!mySubject) {
        toast.error("You are not assigned a subject for this class.");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = {
        classId: selectedClassForMarks._id,
        subjectName: mySubject.subject.name,
        examType: "Term 1", // Hardcoded for now, could be a dropdown
        totalMaxMarks: Number(maxMarks),
        marksData: Object.entries(marksState).map(([studentId, score]) => ({
          studentId,
          score: Number(score),
        })),
      };

      await axios.post(
        "http://localhost:5000/api/teacher/marks",
        payload,
        config
      );
      toast.success("Marks saved successfully!");
    } catch (error) {
      toast.error("Failed to save marks");
      console.error(error);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      if (!announcementData.title || !announcementData.content) {
        toast.error("Please fill in title and content");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(
        "http://localhost:5000/api/teacher/announcements",
        announcementData,
        config
      );
      toast.success("Announcement posted successfully!");
      setAnnouncementData({
        title: "",
        content: "",
        audience: ["Student"],
        classId: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to post announcement"
      );
      console.error(error);
    }
  };

  const toggleAudience = (type) => {
    setAnnouncementData((prev) => {
      const newAudience = prev.audience.includes(type)
        ? prev.audience.filter((a) => a !== type)
        : [...prev.audience, type];
      return { ...prev, audience: newAudience };
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(
          "http://localhost:5000/api/auth/profile",
          config
        );
        setTeacherData(data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    if (user) fetchProfile();
  }, [user]);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "My Classes", icon: <FaSchool /> },
    { name: "Attendance Entry", icon: <FaCheckSquare /> },
    { name: "Marks Entry", icon: <FaEdit /> },
    { name: "Announcements", icon: <FaBullhorn /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-row font-sans relative">
      <ToastContainer position="top-right" autoClose={3000} />
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
          <div className="bg-purple-600 w-10 h-10 rounded-xl shadow-lg flex items-center justify-center transform rotate-3 hover:rotate-0 transition-all duration-300">
            <FaGraduationCap className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              Eluria School
            </h1>
            <p className="text-sm text-gray-400 font-medium">Teacher Portal</p>
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
                        ? "bg-purple-50 text-purple-600 shadow-sm translate-x-1"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
            >
              <span
                className={`text-xl transition-colors ${
                  activeTab === item.name
                    ? "text-purple-600"
                    : "text-gray-400 group-hover:text-purple-400"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.name}</span>
              {activeTab === item.name && (
                <motion.div
                  layoutId="teacherActiveIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-600"
                />
              )}
            </button>
          ))}
        </div>

        {/* User Profile & Logout (Bottom) */}
        <div className="p-5 border-t border-gray-100 bg-white">
          <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {user?.name?.charAt(0) || "T"}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-gray-800 truncate">
                {user?.name || "Teacher"}
              </h4>
              <p className="text-xs text-gray-500 truncate">Teacher</p>
            </div>
          </div>

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
          <span className="font-bold text-gray-700">Teacher Portal</span>
          <div className="w-8"></div>
        </div>

        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{activeTab}</h2>
            <p className="text-gray-500 mt-1">
              Manage your classroom efficiently.
            </p>
          </div>
          <div className="flex items-center gap-4 hidden md:flex">
            {/* Header Notifications or Profile Actions could go here */}
            <button className="p-2 rounded-full bg-white shadow-sm text-gray-400 hover:text-purple-600 transition-colors">
              <FaBullhorn />
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
                    title="Total Classes"
                    value={
                      teacherData?.teacherDetails?.assignedClasses?.length || 0
                    }
                    icon={<FaSchool />}
                    color="bg-purple-100 text-purple-600"
                  />
                  <KPICard
                    title="Classes Today"
                    value="4"
                    icon={<FaChalkboardTeacher />}
                    color="bg-blue-100 text-blue-600"
                  />
                  <KPICard
                    title="Pending Marks"
                    value="12"
                    icon={<FaEdit />}
                    color="bg-orange-100 text-orange-600"
                  />
                </div>
              </div>
            ) : activeTab === "My Classes" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teacherData?.teacherDetails?.assignedClasses &&
                teacherData.teacherDetails.assignedClasses.length > 0 ? (
                  teacherData.teacherDetails.assignedClasses.map((cls) => {
                    const mySubjects =
                      cls.subjects?.filter((s) => s.teacher === user?._id) ||
                      [];
                    return (
                      <div
                        key={cls._id}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-sm font-bold">
                            {cls.name} - {cls.section}
                          </div>
                          <FaSchool className="text-gray-300 text-xl" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                            Subjects You Teach
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {mySubjects.length > 0 ? (
                              mySubjects.map((sub, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium"
                                >
                                  {sub.subject?.name} ({sub.subject?.code})
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-gray-400 italic">
                                No specific subjects assigned
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-400">
                    <p>No classes assigned to you yet.</p>
                  </div>
                )}
              </div>
            ) : activeTab === "Attendance Entry" ? (
              <div className="space-y-6">
                {!selectedClassForAttendance ? (
                  <>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Select a Class to Mark Attendance
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {teacherData?.teacherDetails?.assignedClasses &&
                        teacherData.teacherDetails.assignedClasses.map(
                          (cls) => (
                            <div
                              key={cls._id}
                              onClick={() => {
                                setSelectedClassForAttendance(cls);
                                fetchClassStudents(cls._id);
                              }}
                              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                            >
                              <div className="flex justify-between items-center mb-4">
                                <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                  <FaSchool className="text-purple-600 text-xl" />
                                </div>
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                                  {cls.section}
                                </span>
                              </div>
                              <h4 className="text-lg font-bold text-gray-800">
                                {cls.name}
                              </h4>
                              <p className="text-sm text-gray-400 mt-1">
                                Click to view students
                              </p>
                            </div>
                          )
                        )}
                    </div>
                  </>
                ) : (
                  <div>
                    <button
                      onClick={() => {
                        setSelectedClassForAttendance(null);
                        setClassStudents([]);
                      }}
                      className="mb-6 text-sm text-gray-500 hover:text-purple-600 flex items-center gap-2 font-bold"
                    >
                      &larr; Back to Classes
                    </button>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Attendance: {selectedClassForAttendance.name} -{" "}
                        {selectedClassForAttendance.section}
                      </h3>
                      <button
                        onClick={handleSaveAttendance}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:shadow-lg transition-all"
                      >
                        Save Attendance
                      </button>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                      <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-xs">
                          <tr>
                            <th className="px-6 py-4">Roll No</th>
                            <th className="px-6 py-4">Student Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {classStudents.map((student, idx) => (
                            <tr
                              key={student._id}
                              className="hover:bg-gray-50/50"
                            >
                              <td className="px-6 py-4 font-mono text-gray-500">
                                {student.studentDetails?.rollNumber || idx + 1}
                              </td>
                              <td className="px-6 py-4 font-bold text-gray-800">
                                {student.name}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`attendance-${student._id}`}
                                      className="text-green-600 focus:ring-green-500"
                                      checked={
                                        attendanceState[student._id]?.status ===
                                        "Present"
                                      }
                                      onChange={() =>
                                        setAttendanceState({
                                          ...attendanceState,
                                          [student._id]: {
                                            ...attendanceState[student._id],
                                            status: "Present",
                                          },
                                        })
                                      }
                                    />
                                    <span className="text-xs font-bold text-green-600">
                                      Present
                                    </span>
                                  </label>
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`attendance-${student._id}`}
                                      className="text-red-500 focus:ring-red-500"
                                      checked={
                                        attendanceState[student._id]?.status ===
                                        "Absent"
                                      }
                                      onChange={() =>
                                        setAttendanceState({
                                          ...attendanceState,
                                          [student._id]: {
                                            ...attendanceState[student._id],
                                            status: "Absent",
                                          },
                                        })
                                      }
                                    />
                                    <span className="text-xs font-bold text-red-500">
                                      Absent
                                    </span>
                                  </label>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <input
                                  type="text"
                                  placeholder="Optional remark"
                                  className="w-full px-3 py-1 border rounded text-xs outline-none focus:border-purple-500"
                                  value={
                                    attendanceState[student._id]?.remarks || ""
                                  }
                                  onChange={(e) =>
                                    setAttendanceState({
                                      ...attendanceState,
                                      [student._id]: {
                                        ...attendanceState[student._id],
                                        remarks: e.target.value,
                                      },
                                    })
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                          {classStudents.length === 0 && (
                            <tr>
                              <td
                                colSpan="4"
                                className="text-center py-8 text-gray-400"
                              >
                                No students found in this class.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === "Marks Entry" ? (
              <div className="space-y-6">
                {!selectedClassForMarks ? (
                  <>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Select a Class to Enter Marks
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {teacherData?.teacherDetails?.assignedClasses &&
                        teacherData.teacherDetails.assignedClasses.map(
                          (cls) => (
                            <div
                              key={cls._id}
                              onClick={() => {
                                setSelectedClassForMarks(cls);
                                fetchClassStudents(cls._id);
                              }}
                              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                            >
                              <div className="flex justify-between items-center mb-4">
                                <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                  <FaSchool className="text-purple-600 text-xl" />
                                </div>
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                                  {cls.section}
                                </span>
                              </div>
                              <h4 className="text-lg font-bold text-gray-800">
                                {cls.name}
                              </h4>
                              <p className="text-sm text-gray-400 mt-1">
                                Click to view students
                              </p>
                            </div>
                          )
                        )}
                    </div>
                  </>
                ) : (
                  <div>
                    <button
                      onClick={() => {
                        setSelectedClassForMarks(null);
                        setClassStudents([]);
                      }}
                      className="mb-6 text-sm text-gray-500 hover:text-purple-600 flex items-center gap-2 font-bold"
                    >
                      &larr; Back to Classes
                    </button>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {selectedClassForMarks.name} -{" "}
                        {selectedClassForMarks.section}
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-bold text-gray-600">
                            Max Marks:
                          </label>
                          <input
                            type="number"
                            value={maxMarks}
                            onChange={(e) => setMaxMarks(e.target.value)}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-center font-bold"
                          />
                        </div>
                        <button
                          onClick={handleSaveMarks}
                          className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm hover:shadow-lg transition-all"
                        >
                          Save Marks
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                      <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-xs">
                          <tr>
                            <th className="px-6 py-4">Roll No</th>
                            <th className="px-6 py-4">Student Name</th>
                            <th className="px-6 py-4">Marks (Obtained)</th>
                            <th className="px-6 py-4">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {classStudents.map((student, idx) => (
                            <tr
                              key={student._id}
                              className="hover:bg-gray-50/50"
                            >
                              <td className="px-6 py-4 font-mono text-gray-500">
                                {student.studentDetails?.rollNumber || idx + 1}
                              </td>
                              <td className="px-6 py-4 font-bold text-gray-800">
                                {student.name}
                              </td>
                              <td className="px-6 py-4">
                                <input
                                  type="number"
                                  placeholder="0"
                                  className="w-20 px-3 py-1 border rounded focus:ring-2 focus:ring-purple-500 outline-none"
                                  value={marksState[student._id] || ""}
                                  onChange={(e) =>
                                    setMarksState({
                                      ...marksState,
                                      [student._id]: e.target.value,
                                    })
                                  }
                                />
                              </td>
                              <td className="px-6 py-4 text-gray-400">
                                / {maxMarks}
                              </td>
                            </tr>
                          ))}
                          {classStudents.length === 0 && (
                            <tr>
                              <td
                                colSpan="4"
                                className="text-center py-8 text-gray-400"
                              >
                                No students found in this class.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === "Announcements" ? (
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Create Announcement
                </h3>
                <form
                  onSubmit={handleCreateAnnouncement}
                  className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6"
                >
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                      placeholder="e.g., Upcoming Science Fair"
                      value={announcementData.title}
                      onChange={(e) =>
                        setAnnouncementData({
                          ...announcementData,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
                      placeholder="Write your announcement here..."
                      value={announcementData.content}
                      onChange={(e) =>
                        setAnnouncementData({
                          ...announcementData,
                          content: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Target Audience
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            checked={announcementData.audience.includes(
                              "Student"
                            )}
                            onChange={() => toggleAudience("Student")}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Students
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            checked={announcementData.audience.includes(
                              "Parent"
                            )}
                            onChange={() => toggleAudience("Parent")}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Parents
                          </span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Target Class (Optional)
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-white"
                        value={announcementData.classId}
                        onChange={(e) =>
                          setAnnouncementData({
                            ...announcementData,
                            classId: e.target.value,
                          })
                        }
                      >
                        <option value="">All My Classes</option>
                        {teacherData?.teacherDetails?.assignedClasses?.map(
                          (cls) => (
                            <option key={cls._id} value={cls._id}>
                              {cls.name} - {cls.section}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    Post Announcement
                  </button>
                </form>
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

const KPICard = ({ title, value, icon, color }) => (
  <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
    <div>
      <p className="text-sm font-medium text-gray-500 group-hover:text-purple-600 transition-colors">
        {title}
      </p>
      <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
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
    <div className="text-6xl mb-4 opacity-20 bg-purple-50 p-8 rounded-full text-purple-600">
      {item?.icon}
    </div>
    <h3 className="text-xl font-bold text-gray-700 mb-1">{item?.name}</h3>
    <p className="text-sm">Manage your {item?.name?.toLowerCase()} here.</p>
  </div>
);

export default TeacherDashboard;
