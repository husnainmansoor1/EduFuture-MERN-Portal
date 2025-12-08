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
            width="200"
            height="50"
            viewBox="0 0 300 100"
          >
            {/* <!-- Gradient background for unique shine effect --> */}
            <defs>
              <linearGradient
                id="bgGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#6a0dad", stopOpacity: 1 }}
                />
                <stop
                  offset="0%"
                  style={{ stopColor: "#9b30ff", stopOpacity: 1 }}
                />
                <stop
                  offset="0%"
                  style={{ stopColor: "#4b0082", stopOpacity: 1 }}
                />
              </linearGradient>

              {/* <!-- Subtle shine overlay --> */}
              <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="white" stop-opacity="0.3" />
                <stop offset="50%" stop-color="white" stop-opacity="0" />
                <stop offset="100%" stop-color="white" stop-opacity="0.3" />
              </linearGradient>
            </defs>

            {/* <!-- Square background with gradient --> */}
            <rect
              x="0"
              y="0"
              width="130"
              height="100"
              rx="15"
              ry="15"
              fill="url(#bgGradient)"
            />

            {/* <!-- Shine effect on top of background --> */}
            <rect
              x="0"
              y="0"
              width="130"
              height="100"
              rx="15"
              ry="15"
              fill="url(#shine)"
            />

            {/* <!-- BOOK SHAPE inside background --> */}
            <rect x="50" y="55" width="70" height="10" rx="5" fill="#ff6b4a" />
            <rect x="50" y="70" width="70" height="10" rx="5" fill="#ffb347" />

            {/* <!-- TEXT EDU inside background --> */}
            <text
              x="10"
              y="60"
              font-family="Manufacturing Consent, system-ui"
              font-size="60"
              font-weight="600"
              fill="#ffffff"
            >
              Edu
            </text>

            {/* <!-- TEXT FUTURE outside background --> */}
            <text
              x="160"
              y="63"
              font-family="Inter, sans-serif"
              font-size="30"
              font-weight="900"
              fill="#06b6d4"
            >
              FUTURE
            </text>
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
