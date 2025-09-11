import { FaSignOutAlt, FaMoon, FaSun, FaPlus, FaBars } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../styles/Navbar.css";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

export default function Navbar({ onCreateClick, onSidebarToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, setTheme } = useTheme();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    toast.success("Logged out successfully", { duration: 2000 });
  };

  const isDashboard = location.pathname.startsWith("/dashboard/teacher");
  const isViewClass = /^\/view-class\/[a-zA-Z0-9]+$/.test(location.pathname);
  const isStudentDashboard = location.pathname.startsWith("/dashboard/student");

  // Theme toggle
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  // Dynamic create button title
  const getCreateTitle = () => {
    if (isDashboard) return "Create Class";
    if (isViewClass) return "Announcement";
    if (isStudentDashboard) return "Join Class";
    return "Create";
  };

  return (
    <nav className="navbar">
      {/* Left Section: Sidebar toggle + Logo */}
      <div className="navbar-left">
        {token && onSidebarToggle && (
          <button className="navbar-icon-btn" onClick={onSidebarToggle}>
            <FaBars />
          </button>
        )}
        <div className="navbar-logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="230"
            height="50"
            viewBox="0 0 250 70"
          >
            <path
              d="M35 5 L65 20 L65 50 L35 65 L5 50 L5 20 Z"
              fill="#2c88d9"
              stroke="#83b5fb"
              strokeWidth="2"
            />
            <path d="M20 18 L35 12 L50 18 L35 24 Z" fill="black" />
            <line
              x1="35"
              y1="24"
              x2="35"
              y2="30"
              stroke="black"
              strokeWidth="2"
            />
            <text
              x="35"
              y="48"
              fontFamily="Manufacturing Consent, system-ui"
              fontSize="18"
              fontWeight="bold"
              fill="white"
              textAnchor="middle"
            >
              HM
            </text>
            <text
              x="80"
              y="47"
              fontFamily="Manufacturing Consent, system-ui"
              fontSize="40"
              fontWeight="700"
              fill="#2c88d9"
              stroke="#a4c3ef"
              title="HM Learning portal"
            >
              Learning
            </text>
            <title>HM Learning Portal</title>
          </svg>
        </div>
      </div>

      {/* Right Section: Create + Theme + Logout */}
      <div className="navbar-actions">
        {token && onCreateClick && (
          <button
            className="navbar-icon-btn"
            onClick={onCreateClick}
            title={getCreateTitle()}
          >
            <FaPlus />
          </button>
        )}

        <button
          className="navbar-icon-btn"
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>

        {token && (
          <div
            className="navbar-button-logout"
            onClick={handleLogout}
            title="Logout"
          >
            <FaSignOutAlt />
          </div>
        )}
      </div>
    </nav>
  );
}
