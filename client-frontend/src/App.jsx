import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Auth from "./pages/Auth";
import TeacherDashboard from "./pages/TeacherDashboard";
import ViewClass from "./pages/ViewClass";
import StudentDashBoard from "./pages/StudentDashBoard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { BackgroundProvider } from "./context/BackgroundContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FrontPage from "./pages/FrontPage";
import Setting from "./components/Setting";

// Admin Pages
import AdminPending from "./pages/AdminPending";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminTeachers from "./pages/AdminTeachers";
import AdminApprovals from "./pages/AdminApprovals";

export default function App() {
  return (
    <ThemeProvider>
      <BackgroundProvider>
        <Router>
          <Routes>
            <Route path="/" element={<FrontPage />} />
            {/* Public Routes */}
            <Route path="/login" element={<Auth initialMode="login" />} />
            <Route path="/register" element={<Auth initialMode="register" />} />

            {/* Admin Routes */}
            <Route
              path="/admin/pending"
              element={<AdminPending />}
            />
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute
                  element={() => <AdminDashboard />}
                  role="admin"
                />
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute
                  element={() => <AdminStudents />}
                  role="admin"
                />
              }
            />
            <Route
              path="/admin/teachers"
              element={
                <ProtectedRoute
                  element={() => <AdminTeachers />}
                  role="admin"
                />
              }
            />
            <Route
              path="/admin/approvals"
              element={
                <ProtectedRoute
                  element={() => <AdminApprovals />}
                  role="admin"
                />
              }
            />

            {/* Teacher Routes */}
            <Route
              path="/dashboard/teacher"
              element={
                <ProtectedRoute
                  element={() => <TeacherDashboard />}
                  role="teacher"
                />
              }
            />
            <Route
              path="/view-class/:classID"
              element={
                <ProtectedRoute element={() => <ViewClass />} role="teacher" />
              }
            />

            {/* Student Routes */}
            <Route
              path="/dashboard/student"
              element={
                <ProtectedRoute
                  element={() => <StudentDashBoard />}
                  role="student"
                />
              }
            />
            <Route
              path="/student/class/:classID"
              element={
                <ProtectedRoute
                  element={() => <ViewClass />}
                  role="student"
                />
              }
            />
            <Route
              path="/setting"
              element={<ProtectedRoute element={() => <Setting />} />}
            />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            theme="light"
          />{" "}
        </Router>
      </BackgroundProvider>
    </ThemeProvider>
  );
}
