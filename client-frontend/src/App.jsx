import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
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

export default function App() {
  return (
    <ThemeProvider>
      <BackgroundProvider>
        <Router>
          <Routes>
            <Route path="/" element={<FrontPage />} />
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

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
