import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaCog, FaSignOutAlt } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import "../styles/Sidebar.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Sidebar({ onCreateClick, isOpen, onSettingClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSubjects, setShowSubjects] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [enrollData, setEnrollData] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const token = localStorage.getItem("token");
    const API_BASE = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (role === "teacher") {
          const res = await axios.get(`${API_BASE}/api/classes/my`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSubjects(
            Array.isArray(res.data) ? res.data.filter((c) => c && c._id) : []
          );
        } else if (role === "student") {
          const res = await axios.get(
            `${API_BASE}/api/students/enrolled`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setEnrollData(
            Array.isArray(res.data) ? res.data.filter((c) => c && c._id) : []
          );
        }
      } catch (error) {
        console.error("Sidebar fetch error:", error);
      }
    };

    fetchData();
  }, [role, token, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    toast.success("Logged out successfully", { autoClose: 4000 });
  };

  const handleMouseEnter = () => {
    if (!isOpen) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isOpen) {
      setIsHovered(false);
    }
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

  const getClassTitle = () => {
    if (role === "teacher") return "Teaching";
    if (role === "student") return "Enrollment";
    return "";
  };

  const classList = role === "teacher" ? subjects : enrollData;

  // Determine if sidebar should show expanded content
  const shouldShowExpanded = isOpen || isHovered;

  return (
    <aside
      className={`
        sidebar
        ${isOpen ? "expanded" : "collapsed"}
        ${isHovered ? "hover-expanded" : ""}
        flex flex-col overflow-y-auto overflow-x-hidden  bg-[var(--bg-color)]
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-300 dark:bg-cyan-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <ul className="sidebar-ul flex flex-col gap-2 mt-20 px-0 flex-grow">
        {/* HOME */}
        <Link
          className="sidebar-li flex items-center gap-3 px-3 py-2 hover:bg-gray-300 transition rounded-md"
          to="/dashboard/teacher"
          title="Home"
        >
          <FaHome size={25} />
          {shouldShowExpanded && <span>Home</span>}
        </Link>

        {/* CREATE / JOIN / ANNOUNCEMENT */}
        {onCreateClick && (
          <li
            className="sidebar-li flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-300 transition rounded-md"
            onClick={onCreateClick}
            title={getCreateTitle()}
          >
            <FaPlus size={25} />
            {shouldShowExpanded && <span>{getCreateTitle()}</span>}
          </li>
        )}

        {/* TEACHING / ENROLLMENT */}
        <li
          className="sidebar-li flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-300 transition rounded-md"
          title={getClassTitle()}
          onClick={() => shouldShowExpanded && setShowSubjects(!showSubjects)}
        >
          <IoPeopleSharp size={25} />
          {shouldShowExpanded && (
            <span className="flex justify-between w-40">
              {getClassTitle()}
              {showSubjects ? (
                <FaChevronUp size={18} />
              ) : (
                <FaChevronDown size={18} />
              )}
            </span>
          )}
        </li>

        {/* SUBJECT LIST */}
        {shouldShowExpanded && showSubjects && (
          <div className="sidebar-subjects mt-4 px-2">
            {classList?.length > 0 ? (
              <ul className="subjects-list flex flex-col gap-2">
                {classList
                  ?.filter((cls) => cls && cls._id)
                  .map((cls) => (
                    <li key={cls._id}>
                      <Link
                        to={
                          role === "teacher"
                            ? `/view-class/${cls._id}`
                            : `/student/class/${cls._id}`
                        }
                        className="subject-item flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-300 transition"
                      >
                        <div className="subject-avatar flex items-center justify-center rounded-full font-bold text-sm">
                          {cls.subject?.charAt(0).toUpperCase()}
                        </div>
                        <span>{cls.subject}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="no-subjects text-gray-500 text-sm">
                No {getClassTitle()} Found
              </p>
            )}
          </div>
        )}

        {/* LOGOUT */}
        <li
          className="sidebar-li flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-300 transition rounded-md"
          onClick={handleLogout}
          title="Logout"
        >
          <FaSignOutAlt size={25} />
          {shouldShowExpanded && <span>Logout</span>}
        </li>

        {/* SETTINGS */}
        <li onClick={onSettingClick} title="Settings">
          <Link
            to="/setting"
            className="sidebar-li flex items-center gap-3 px-3 py-2 hover:bg-gray-300 transition rounded-md"
          >
            <FaCog size={25} />
            {shouldShowExpanded && <span>Settings</span>}
          </Link>
        </li>
      </ul>
    </aside>
  );
}
