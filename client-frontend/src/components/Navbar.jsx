import { FaSignOutAlt, FaPlus, FaBars, FaUserCircle, FaCamera } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../styles/Navbar.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Navbar({ onCreateClick, onSidebarToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, setTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const API_BASE = import.meta.env.VITE_API_URL;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    toast.success("Logged out successfully", { duration: 2000 });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.put(`${API_BASE}/api/auth/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = { ...user, image: res.data.user.image };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile image");
    }
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
                <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                <stop offset="50%" stopColor="white" stopOpacity="0" />
                <stop offset="100%" stopColor="white" stopOpacity="0.3" />
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
              fontFamily="Manufacturing Consent, system-ui"
              fontSize="60"
              fontWeight="600"
              fill="#ffffff"
            >
              Edu
            </text>

            {/* <!-- TEXT FUTURE outside background --> */}
            <text
              x="160"
              y="63"
              fontFamily="Inter, sans-serif"
              fontSize="30"
              fontWeight="900"
              fill="#06b6d4"
            >
              FUTURE
            </text>
          </svg>
        </div>
      </div>

      {/* Right Section */}
      <div className="navbar-actions flex items-center gap-3 mr-2">
        {/* Profile */}
        {token && (
          <div className="navbar-profile relative" ref={profileRef}>
            <div 
               className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1 transition-all"
               onClick={() => setShowProfile((p) => !p)}
            >
                 {user?.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-gray-200"
                  />
                ) : (
                   <FaUserCircle size={40} className="text-gray-600 dark:text-gray-300" />
                )}
            </div>

            {showProfile && (
              <div className="absolute right-0 top-14 w-80 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-fade-in-up">
                {/* Profile Header (Centered) */}
                <div className="flex flex-col items-center pt-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                   <div className="relative group cursor-pointer mb-3" onClick={handleImageClick}>
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                          {user?.image ? (
                            <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full bg-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                             </div>
                          )}
                      </div>
                      {/* Camera Overlay */}
                      <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-1.5 rounded-full shadow-md border border-gray-200 dark:border-gray-600">
                          <FaCamera className="text-gray-600 dark:text-gray-300 text-xs" />
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                   </div>
                   
                   <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                      Hi, {user?.name || "User"}!
                   </h2>
                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{user?.email}</p>
                   
                   <button className="text-blue-600 dark:text-blue-400 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-full px-6 py-2 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      Manage your Account
                   </button>
                </div>

                {/* Bottom Logout */}
                <div className="p-4 flex justify-center bg-gray-50 dark:bg-[#1a1a1a]">
                   <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium text-gray-700 dark:text-gray-200 text-sm shadow-sm"
                   >
                      <FaSignOutAlt />
                      Sign out
                   </button>
                </div>
                
                {/* Footer Links */}
                <div className="flex justify-center gap-4 py-3 text-xs text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700/50">
                    <span className="hover:underline cursor-pointer">Privacy Policy</span>
                    <span>•</span>
                    <span className="hover:underline cursor-pointer">Terms of Service</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
