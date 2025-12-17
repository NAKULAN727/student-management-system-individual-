import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSchool,
  FaBook,
  FaBullhorn,
  FaSignOutAlt,
  FaTrash,
  FaUserPlus,
  FaUserTie,
  FaBars,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // User Management State
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
    classId: "",
  });
  const [loading, setLoading] = useState(false);

  // Class Management State
  const [classes, setClasses] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [newClass, setNewClass] = useState({
    name: "",
    section: "",
    subjects: "",
  });

  // Subject & Announcement State
  const [subjects, setSubjects] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showCreateSubjectModal, setShowCreateSubjectModal] = useState(false);
  const [showCreateAnnouncementModal, setShowCreateAnnouncementModal] =
    useState(false);
  const [newSubject, setNewSubject] = useState({
    name: "",
    code: "",
    department: "",
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    audience: "All",
  });

  useEffect(() => {
    // Determine when to fetch data based on active tab
    // We need Users (Teachers) and Subjects available in Classes tab for the Manage Subjects modal
    if (["Dashboard", "Students", "Teachers", "Classes"].includes(activeTab)) {
      fetchUsers();
    }
    if (["Dashboard", "Classes", "Teachers", "Students"].includes(activeTab)) {
      fetchClasses();
    }
    if (["Dashboard", "Subjects", "Classes"].includes(activeTab)) {
      fetchSubjects();
    }
    if (["Dashboard", "Announcements"].includes(activeTab)) {
      fetchAnnouncements();
    }
    // eslint-disable-next-line
  }, [activeTab]);

  const fetchSubjects = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.get(
        "http://localhost:5000/api/admin/subjects",
        config
      );
      setSubjects(response.data);
    } catch (error) {
      console.error("Failed to fetch subjects", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.get(
        "http://localhost:5000/api/admin/announcements",
        config
      );
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Failed to fetch announcements", error);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(
        "http://localhost:5000/api/admin/subjects",
        newSubject,
        config
      );
      toast.success("Subject added successfully!");
      setShowCreateSubjectModal(false);
      setNewSubject({ name: "", code: "", department: "" });
      fetchSubjects();
    } catch (error) {
      toast.error("Failed to add subject");
    }
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(
          `http://localhost:5000/api/admin/subjects/${id}`,
          config
        );
        toast.success("Subject deleted successfully");
        fetchSubjects();
      } catch (error) {
        toast.error("Failed to delete subject");
      }
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(
        "http://localhost:5000/api/admin/announcements",
        newAnnouncement,
        config
      );
      toast.success("Announcement posted successfully!");
      setShowCreateAnnouncementModal(false);
      setNewAnnouncement({ title: "", content: "", audience: "All" });
      fetchAnnouncements();
    } catch (error) {
      toast.error("Failed to post announcement");
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(
          `http://localhost:5000/api/admin/announcements/${id}`,
          config
        );
        toast.success("Announcement deleted successfully");
        fetchAnnouncements();
      } catch (error) {
        toast.error("Failed to delete announcement");
      }
    }
  };

  const handleDeleteClass = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(
          `http://localhost:5000/api/admin/classes/${id}`,
          config
        );
        toast.success("Class deleted successfully");
        fetchClasses();
      } catch (error) {
        toast.error("Failed to delete class");
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        config
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.get(
        "http://localhost:5000/api/admin/classes",
        config
      );
      setClasses(response.data);
    } catch (error) {
      console.error("Failed to fetch classes", error);
    }
  };

  const [showManageSubjectsModal, setShowManageSubjectsModal] = useState(false);
  const [selectedClassForSubjects, setSelectedClassForSubjects] =
    useState(null);
  const [newSubjectAssignment, setNewSubjectAssignment] = useState({
    subjectId: "",
    teacherId: "",
  });

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(
        "http://localhost:5000/api/admin/classes",
        { name: newClass.name, section: newClass.section },
        config
      );
      toast.success("Class created successfully!");
      setShowCreateClassModal(false);
      setNewClass({ name: "", section: "", subjects: "" });
      fetchClasses();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create class");
    }
  };

  const handleAddSubjectToClass = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.post(
        `http://localhost:5000/api/admin/classes/${selectedClassForSubjects._id}/subjects`,
        newSubjectAssignment,
        config
      );
      toast.success("Subject assigned to class!");
      setNewSubjectAssignment({ subjectId: "", teacherId: "" });

      // Update the local list so the user sees the change immediately
      setSelectedClassForSubjects(response.data);

      // Refresh background table
      fetchClasses();

      // Keep modal open for adding more subjects
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign subject");
    }
  };

  const ClassesTable = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-lg font-bold text-gray-800">Manage Classes</h3>
        <button
          onClick={() => setShowCreateClassModal(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <FaUserPlus /> Add Class
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4 rounded-tl-lg">Class Name</th>
              <th className="px-6 py-4">Section</th>
              <th className="px-6 py-4">Subjects (Teacher)</th>
              <th className="px-6 py-4 rounded-tr-lg text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {classes.map((cls) => (
              <tr
                key={cls._id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-bold text-gray-800">
                  {cls.name}
                </td>
                <td className="px-6 py-4">{cls.section}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {cls.subjects && cls.subjects.length > 0 ? (
                      cls.subjects.map((sub, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs"
                        >
                          {sub.subject?.name} ({sub.teacher?.name})
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs text-italic">
                        No subjects
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedClassForSubjects(cls);
                      setShowManageSubjectsModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded text-xs font-bold whitespace-nowrap"
                  >
                    Manage Subjects
                  </button>
                  <button
                    onClick={() => handleDeleteClass(cls._id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {classes.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-400">
                  No classes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post(
        "http://localhost:5000/api/admin/users",
        newUser,
        config
      );
      toast.success("User created successfully!");
      setShowCreateModal(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "Student",
        classId: "",
      });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.delete(
          `http://localhost:5000/api/admin/users/${id}`,
          config
        );
        toast.success("User deleted");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openCreateModal = (preselectedRole) => {
    setNewUser((prev) => ({ ...prev, role: preselectedRole || "Student" }));
    setShowCreateModal(true);
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Students", icon: <FaUserGraduate /> },
    { name: "Teachers", icon: <FaChalkboardTeacher /> },
    { name: "Classes", icon: <FaSchool /> },
    { name: "Subjects", icon: <FaBook /> },
    { name: "Announcements", icon: <FaBullhorn /> },
  ];

  // Helper to filter users
  const getFilteredUsers = (role) => {
    return users.filter((u) => u.role === role);
  };

  const DashboardContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        title="Total Students"
        value={getFilteredUsers("Student").length}
        icon={<FaUserGraduate />}
        color="bg-blue-100 text-blue-600"
      />
      <StatCard
        title="Total Teachers"
        value={getFilteredUsers("Teacher").length}
        icon={<FaChalkboardTeacher />}
        color="bg-green-100 text-green-600"
      />
      <StatCard
        title="Classes"
        value="12"
        icon={<FaSchool />}
        color="bg-orange-100 text-orange-600"
      />
      <StatCard
        title="Subjects"
        value="8"
        icon={<FaBook />}
        color="bg-purple-100 text-purple-600"
      />
    </div>
  );

  const UsersTable = ({ role, data }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-lg font-bold text-gray-800">Manage {role}s</h3>
        <button
          onClick={() =>
            openCreateModal(
              role === "Student"
                ? "Student"
                : role === "Teacher"
                ? "Teacher"
                : "Student"
            )
          }
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <FaUserPlus /> Add {role}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4 rounded-tl-lg">Name</th>
              <th className="px-6 py-4 hidden md:table-cell">Email</th>
              {role === "Teacher" && (
                <th className="px-6 py-4">Assigned Classes</th>
              )}
              <th className="px-6 py-4 hidden md:table-cell">Joined Date</th>
              <th className="px-6 py-4 rounded-tr-lg text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      u.role === "Student"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div>{u.name}</div>
                    <div className="text-xs text-gray-400 md:hidden">
                      {u.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">{u.email}</td>
                {role === "Teacher" && (
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {u.teacherDetails?.assignedClasses &&
                      u.teacherDetails.assignedClasses.length > 0 ? (
                        u.teacherDetails.assignedClasses.map((c) => (
                          <span
                            key={c._id || c}
                            className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs"
                          >
                            {c.name} {c.section}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs text-italic">
                          None
                        </span>
                      )}
                    </div>
                  </td>
                )}
                <td className="px-6 py-4 hidden md:table-cell">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                  {role === "Teacher" && (
                    <button
                      onClick={() => {
                        setSelectedTeacher(u);
                        setShowAssignModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded text-xs font-bold whitespace-nowrap"
                    >
                      Assign Class
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={role === "Teacher" ? 5 : 4}
                  className="text-center py-8 text-gray-400"
                >
                  No {role.toLowerCase()}s found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const handleAssignClass = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(
        "http://localhost:5000/api/admin/assign-class",
        { teacherId: selectedTeacher._id, classId: selectedClassId },
        config
      );
      toast.success("Class assigned to teacher!");
      setShowAssignModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign class");
    }
  };

  const SubjectsTable = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-lg font-bold text-gray-800">Manage Subjects</h3>
        <button
          onClick={() => setShowCreateSubjectModal(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <FaUserPlus /> Add Subject
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4 rounded-tl-lg">Subject Name</th>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4 rounded-tr-lg">Department</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subjects.map((sub) => (
              <tr
                key={sub._id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-bold text-gray-800">
                  {sub.name}
                </td>
                <td className="px-6 py-4">{sub.code}</td>
                <td className="px-6 py-4">{sub.department}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDeleteSubject(sub._id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {subjects.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-400">
                  No subjects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AnnouncementsTable = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="md:col-span-full flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Announcements</h3>
        <button
          onClick={() => setShowCreateAnnouncementModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FaBullhorn /> Post Announcement
        </button>
      </div>
      {announcements.map((ann) => (
        <div
          key={ann._id}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start mb-2">
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${
                  ann.audience === "All"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {ann.audience}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(ann.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">
              {ann.title}
            </h4>
            <p className="text-gray-600 text-sm mb-4">{ann.content}</p>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-50">
            <span className="text-xs text-gray-500 font-medium">
              By: {ann.postedBy?.name || "Admin"}
            </span>
            <button
              onClick={() => handleDeleteAnnouncement(ann._id)}
              className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1"
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      ))}
      {announcements.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
          <FaBullhorn className="text-4xl mx-auto mb-3 opacity-20" />
          <p>No announcements yet.</p>
        </div>
      )}
    </div>
  );

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
        className={`
            fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl flex flex-col border-r border-gray-100 transform transition-transform duration-300
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
        `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="bg-blue-600 w-10 h-10 rounded-xl shadow-md flex items-center justify-center">
            <span className="text-xl text-white font-bold">H</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">
              Horizon School
            </h1>
            <p className="text-xs text-gray-500 font-medium">Admin Portal</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name);
                setIsSidebarOpen(false); // Close menu on mobile when clicked
              }}
              className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      activeTab === item.name
                        ? "bg-blue-50 text-blue-600 translate-x-1"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
            >
              <span
                className={`text-lg ${
                  activeTab === item.name ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.name}</span>
              {activeTab === item.name && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        {/* User Profile & Logout (Bottom) */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-3 mb-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              A
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Admin</p>
              <p className="text-xs text-gray-500">System Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
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
          <span className="font-bold text-gray-700">Horizon Admin</span>
          <div className="w-8"></div> {/* Spacer to center title roughly */}
        </div>

        <header className="mb-8 hidden md:block">
          <h2 className="text-2xl font-bold text-gray-800">{activeTab}</h2>
          <p className="text-sm text-gray-500">
            Overview of your school's data.
          </p>
        </header>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "Dashboard" && <DashboardContent />}
          {activeTab === "Students" && (
            <UsersTable role="Student" data={getFilteredUsers("Student")} />
          )}
          {activeTab === "Teachers" && (
            <UsersTable role="Teacher" data={getFilteredUsers("Teacher")} />
          )}
          {activeTab === "Classes" && <ClassesTable />}
          {activeTab === "Subjects" && <SubjectsTable />}
          {activeTab === "Announcements" && <AnnouncementsTable />}
        </motion.div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {/* Create User Modal */}
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800">
                  Create New {newUser.role}
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-xl"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                  >
                    <option value="Student">Student</option>
                    <option value="Parent">Parent</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                {newUser.role === "Student" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign Class
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                      value={newUser.classId}
                      onChange={(e) =>
                        setNewUser({ ...newUser, classId: e.target.value })
                      }
                    >
                      <option value="">Select a Class</option>
                      {classes.map((cls) => (
                        <option key={cls._id} value={cls._id}>
                          {cls.name} - {cls.section}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Create Class Modal */}
        {showCreateClassModal && (
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
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Add New Class
                </h3>
                <button
                  onClick={() => setShowCreateClassModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleCreateClass} className="space-y-4">
                <input
                  type="text"
                  placeholder="Class Name (e.g. Grade 10)"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={newClass.name}
                  onChange={(e) =>
                    setNewClass({ ...newClass, name: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Section (e.g. A)"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={newClass.section}
                  onChange={(e) =>
                    setNewClass({ ...newClass, section: e.target.value })
                  }
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Create Class
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Create Subject Modal */}
        {showCreateSubjectModal && (
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
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Add New Subject
                </h3>
                <button
                  onClick={() => setShowCreateSubjectModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleCreateSubject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mathematics"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={newSubject.name}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MATH101"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={newSubject.code}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, code: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Science"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={newSubject.department}
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        department: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    Add Subject
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Create Announcement Modal */}
        {showCreateAnnouncementModal && (
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
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Post New Announcement
                </h3>
                <button
                  onClick={() => setShowCreateAnnouncementModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Announcement Title"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={newAnnouncement.title}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    placeholder="Write your announcement here..."
                    className="w-full px-4 py-2 border rounded-lg h-32 resize-none"
                    value={newAnnouncement.content}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        content: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Audience
                  </label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg bg-white"
                    value={newAnnouncement.audience}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        audience: e.target.value,
                      })
                    }
                  >
                    <option value="All">All</option>
                    <option value="Student">Students Only</option>
                    <option value="Teacher">Teachers Only</option>
                    <option value="Parent">Parents Only</option>
                  </select>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    Post Announcement
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Manage Subjects Modal */}
        {showManageSubjectsModal && (
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
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Manage Subjects for {selectedClassForSubjects?.name}
                </h3>
                <button
                  onClick={() => setShowManageSubjectsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  &times;
                </button>
              </div>

              {/* Existing Subjects List */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase">
                  Current Subjects
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedClassForSubjects?.subjects &&
                  selectedClassForSubjects.subjects.length > 0 ? (
                    selectedClassForSubjects.subjects.map((sub, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-gray-50 p-2 rounded"
                      >
                        <div>
                          <p className="font-bold text-sm text-gray-800">
                            {sub.subject?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Teacher: {sub.teacher?.name}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      No subjects assigned yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Add New Subject Form */}
              <form
                onSubmit={handleAddSubjectToClass}
                className="space-y-4 border-t border-gray-100 pt-4"
              >
                <h4 className="text-sm font-bold text-gray-700 uppercase">
                  Add Subject & Teacher
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      Subject
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-lg bg-white text-sm"
                      value={newSubjectAssignment.subjectId}
                      onChange={(e) =>
                        setNewSubjectAssignment({
                          ...newSubjectAssignment,
                          subjectId: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      Teacher
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-lg bg-white text-sm"
                      value={newSubjectAssignment.teacherId}
                      onChange={(e) =>
                        setNewSubjectAssignment({
                          ...newSubjectAssignment,
                          teacherId: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Teacher</option>
                      {users
                        .filter((u) => u.role === "Teacher")
                        .map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Add Subject to Class
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
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
    <div className="text-6xl mb-4 opacity-20 bg-blue-50 p-8 rounded-full text-blue-600">
      {item?.icon}
    </div>
    <h3 className="text-xl font-bold text-gray-700 mb-1">{item?.name}</h3>
    <p className="text-sm">Manage your {item?.name?.toLowerCase()} here.</p>
    <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
      Coming Soon
    </button>
  </div>
);

export default AdminDashboard;
