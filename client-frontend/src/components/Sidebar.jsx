import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaCog, FaSignOutAlt } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import "../styles/Sidebar.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

export default function Sidebar({
  onCreateClick,
  isOpen,
  subjects = [],
  onSettingClick,
  enrollData,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSubjects, setShowSubjects] = useState(true); 
  
  //  Role from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role; 

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
            {isOpen && (
              <span>
                {isDashboard
                  ? "Create Class"
                  : isViewClass
                  ? "Announcement"
                  : isStudentDashboard
                  ? "Join Class"
                  : "Create"}
              </span>
            )}
          </li>
        )}

        <li className="sidebar-li" onClick={handleLogout} title="Logout">
          <FaSignOutAlt size={25} />
          {isOpen && <span>Logout</span>}
        </li>

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

        {/*  Collapsible Subjects */}
        {isOpen && showSubjects && subjects?.length > 0 && (
          <div className="sidebar-subjects">
            <ul className="subjects-list">
              {subjects.map((subj) => (
                <li key={subj._id}>
                  <Link
                    to={`/view-class/${subj._id}`}
                    className="subject-item"
                  >
                    <div className="subject-avatar">
                      {subj.subject?.charAt(0).toUpperCase()}
                    </div>
                    <span>{subj.subject}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

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
