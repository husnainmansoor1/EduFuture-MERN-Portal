import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaPlus,
  FaCog,
  FaSignOutAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import "../styles/Sidebar.css";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";


export default function Sidebar({ onCreateClick, isOpen, subjects = [] }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    toast.success("Logged out successfully" ,{ autoClose: 4000 }); 
  };

  // Path check
  const isDashboard = location.pathname.startsWith("/dashboard/teacher");
  const isViewClass = /^\/view-class\/[a-zA-Z0-9]+$/.test(location.pathname);
  const isStudentDashboard = location.pathname.startsWith("/dashboard/student");

  const getCreateTitle = () => {
    if (isDashboard) return "Create Class";
    if (isViewClass) return "Announcement";
    if (isStudentDashboard) return "Join Class";
    return "Create";
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

        <li className="sidebar-li" onClick={toggleTheme} title="Toggle Theme">
          {theme === "light" ? <FaMoon size={25} /> : <FaSun size={25} />}
          {isOpen && <span>Theme</span>}
        </li>

        <Link className="sidebar-li" to="#" title="Settings">
          <FaCog size={25} />
          {isOpen && <span>Settings</span>}
        </Link>

        <li className="sidebar-li" onClick={handleLogout} title="Logout">
          <FaSignOutAlt size={25} />
          {isOpen && <span>Logout</span>}
        </li>
      </ul>

      {/* Subjects List */}
      {isOpen && subjects?.length > 0 && (
        <div className="sidebar-subjects">
          <h4 className="sidebar-subjects-title">Teaching</h4>
          <ul className="subjects-list">
            {subjects.map((subj) => (
              <li key={subj._id} className="subject-item">
                <div className="subject-avatar">
                  {subj.subject?.charAt(0).toUpperCase()}
                </div>
                <span>{subj.subject}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
