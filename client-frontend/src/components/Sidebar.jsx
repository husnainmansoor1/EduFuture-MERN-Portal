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

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (role === "teacher") {
          const res = await axios.get("http://localhost:5000/api/classes/my", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSubjects(
            Array.isArray(res.data) ? res.data.filter((c) => c && c._id) : []
          );
        } else if (role === "student") {
          const res = await axios.get(
            "http://localhost:5000/api/students/enrolled",
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

  return (
    <aside className={`sidebar ${isOpen ? "expanded" : "collapsed"}`}>
      <ul className="sidebar-ul">
        <Link className="sidebar-li" to="/dashboard/teacher" title="Home">
          <FaHome size={25} />
          {isOpen && <span>Home</span>}
        </Link>

        {onCreateClick && (
          <li
            className="sidebar-li"
            onClick={onCreateClick}
            title={getCreateTitle()}
          >
            <FaPlus size={25} />
            {isOpen && <span>{getCreateTitle()}</span>}
          </li>
        )}

        {/* Teaching/Enrollment Section */}
        <li
          className="sidebar-li"
          title={getClassTitle()}
          onClick={() => setShowSubjects(!showSubjects)}
        >
          <IoPeopleSharp size={25} />
          {isOpen && (
            <span className="teaching-title">
              {getClassTitle()}
              {showSubjects ? (
                <FaChevronUp size={18} className="chevron-icon" />
              ) : (
                <FaChevronDown size={18} className="chevron-icon" />
              )}
            </span>
          )}
        </li>

        {/*  Collapsible Subjects/Enrollment */}
        {isOpen && showSubjects && (
          <div className="sidebar-subjects">
            {classList?.length > 0 ? (
              <ul className="subjects-list">
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
                        className="subject-item"
                      >
                        <div className="subject-avatar">
                          {cls.subject?.charAt(0).toUpperCase()}
                        </div>
                        <span>{cls.subject}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="no-subjects">No {getClassTitle()} Found</p>
            )}
          </div>
        )}

        <li className="sidebar-li" onClick={handleLogout} title="Logout">
          <FaSignOutAlt size={25} />
          {isOpen && <span>Logout</span>}
        </li>

        <li onClick={onSettingClick} title="Settings">
          <Link to="/setting" className=" sidebar-li">
            <FaCog size={25} />
            {isOpen && <span>Settings</span>}
          </Link>
        </li>
      </ul>
    </aside>
  );
}
