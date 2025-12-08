import { FaSignOutAlt, FaPlus, FaBars, FaUserCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../styles/Navbar.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useRef, useEffect } from "react";

export default function Navbar({ onCreateClick, onSidebarToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, setTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    toast.success("Logged out successfully", { duration: 2000 });
  };

  const isDashboard = location.pathname.startsWith("/dashboard/teacher");
  const isViewClass = /^\/view-class\/[a-zA-Z0-9]+$/.test(location.pathname);
  const isStudentDashboard = location.pathname.startsWith("/dashboard/student");

  const getCreateTitle = () => {
    if (isDashboard) return "Create Class";
    if (isViewClass) return "Announcement";
    if (isStudentDashboard) return "Join Class";
    return "Create";
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    }

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  return (
    <nav className="navbar flex justify-between items-center w-full fixed z-50 bg-[var(--bg-color)]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-300 dark:bg-cyan-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      {/* Left Section */}
      <div className="navbar-left flex items-center gap-3">
        {token && onSidebarToggle && (
          <button
            className="navbar-icon-btn p-2 text-xl"
            onClick={onSidebarToggle}
          >
            <FaBars />
          </button>
        )}
        <div className="navbar-logo flex items-center cursor-pointer ml-[-20px]">
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
            >
              Learning
            </text>
            <title>HM Learning Portal</title>
          </svg>
        </div>
      </div>

      {/* Right Section */}
      <div className="navbar-actions flex items-center gap-3 mr-2">
        {token && onCreateClick && (
          <button
            className="navbar-icon-btn p-2 text-xl"
            onClick={onCreateClick}
            title={getCreateTitle()}
          >
            <FaPlus />
          </button>
        )}

        {/* Profile */}
        {token && (
          <div className="navbar-profile relative" ref={profileRef}>
            <FaUserCircle
              size={40}
              className="navbar-icon-btn"
              title="Profile"
              onClick={() => setShowProfile((p) => !p)}
            />
            {showProfile && (
              <div className="profile-dropdown flex flex-col p-4 gap-4">
                {/* Top Email */}
                <p className="profile-top-email text-center">
                  {user?.email || "No Email"}
                </p>

                {/* Middle Section */}
                <div className="profile-header flex flex-col items-center gap-2">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="profile-avatar"
                    />
                  ) : (
                    <FaUserCircle className="profile-avatar-fallback" />
                  )}
                  <h4 className="profile-username font-bold">{`Hi, ${
                    user?.name || "Unknown User"
                  }`}</h4>
                </div>

                {/* Bottom Section */}
                <div className="profile-card flex flex-col gap-3 pt-3 border-t border-gray-200">
                  <div className="profile-info flex items-center gap-2">
                    <FaUserCircle className="profile-info-icon" />
                    <div>
                      <p className="profile-card-name font-bold">
                        {user?.name || "Unknown User"}
                      </p>
                      <p className="profile-card-email">
                        {user?.email || "No Email"}
                      </p>
                    </div>
                  </div>

                  <div
                    className="profile-logout flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-red-100"
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <FaSignOutAlt className="logout-icon" />
                    <span>Logout</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
