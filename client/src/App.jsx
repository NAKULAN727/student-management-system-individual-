import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import About from "./pages/About";
import Contact from "./pages/Contact";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import TeacherDashboard from "./pages/dashboards/TeacherDashboard";
import ParentDashboard from "./pages/dashboards/ParentDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/student/dashboard"
            element={
              <PrivateRoute role="Student">
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/dashboard"
            element={
              <PrivateRoute role="Teacher">
                <TeacherDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/parent/dashboard"
            element={
              <PrivateRoute role="Parent">
                <ParentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute role="Admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
