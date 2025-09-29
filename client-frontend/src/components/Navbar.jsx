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
    <nav className="navbar">
      <div className="navbar-left">
        {token && onSidebarToggle && (
          <button className="navbar-icon-btn" onClick={onSidebarToggle}>
            <FaBars />
          </button>
        )}
        <div className="navbar-logo">
          {/* Logo SVG yahan hoga */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="230"
            height="50"
            viewBox="0 0 250 70"
          >
            {" "}
            <path
              d="M35 5 L65 20 L65 50 L35 65 L5 50 L5 20 Z"
              fill="#2c88d9"
              stroke="#83b5fb"
              strokeWidth="2"
            />{" "}
            <path d="M20 18 L35 12 L50 18 L35 24 Z" fill="black" />{" "}
            <line
              x1="35"
              y1="24"
              x2="35"
              y2="30"
              stroke="black"
              strokeWidth="2"
            />{" "}
            <text
              x="35"
              y="48"
              fontFamily="Manufacturing Consent, system-ui"
              fontSize="18"
              fontWeight="bold"
              fill="white"
              textAnchor="middle"
            >
              {" "}
              HM{" "}
            </text>{" "}
            <text
              x="80"
              y="47"
              fontFamily="Manufacturing Consent, system-ui"
              fontSize="40"
              fontWeight="700"
              fill="#2c88d9"
              stroke="#a4c3ef"
            >
              {" "}
              Learning{" "}
            </text>{" "}
            <title>HM Learning Portal</title>{" "}
          </svg>
        </div>
      </div>

      {/* Right Section */}
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

        {/* Profile Icon */}
        {token && (
          <div className="navbar-profile" ref={profileRef}>
            <FaUserCircle
              size={40}
              className="navbar-icon-btn"
              title="Profile"
              onClick={() => setShowProfile((p) => !p)}
            />

            {showProfile && (
              <div className="profile-dropdown">
                {/*  Top Email */}
                <p className="profile-top-email">{user?.email || "No Email"}</p>

                {/* Middle Section: Profile Image + Name */}
                <div className="profile-header">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="profile-avatar"
                    />
                  ) : (
                    <FaUserCircle className="profile-avatar-fallback" />
                  )}
                  <h4 className="profile-username">
                    Hi, {user?.name || "Unknown User"}
                  </h4>
                </div>

                {/* Bottom Section */}
                <div className="profile-card">
                  <div className="profile-info">
                    <FaUserCircle className="profile-info-icon" />
                    <div>
                      <p className="profile-card-name">
                        {user?.name || "Unknown User"}
                      </p>
                      <p className="profile-card-email">
                        {user?.email || "No Email"}
                      </p>
                    </div>
                  </div>

                  <div
                    className="profile-logout"
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
