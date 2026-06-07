import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUserGraduate, FaChalkboardTeacher, FaUserCheck, FaCog, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminSidebar({ isOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/pending-admins`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingCount(res.data.length);
      } catch (error) {
        console.error("Error fetching pending admin count:", error.response?.status, error.response?.data || error.message);
      }
    };

    if (token) {
      fetchPendingCount();
      // Poll every 30 seconds to keep updated
      const interval = setInterval(fetchPendingCount, 30000);
      return () => clearInterval(interval);
    }
  }, [token, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    toast.success("Logged out successfully", { autoClose: 2000, theme: "dark" });
  };

  const navItems = [
    { path: "/dashboard/admin", label: "Dashboard", icon: <FaHome size={22} /> },
    { path: "/admin/students", label: "Students", icon: <FaUserGraduate size={20} /> },
    { path: "/admin/teachers", label: "Teachers", icon: <FaChalkboardTeacher size={20} /> },
    {
      path: "/admin/approvals",
      label: "Approvals",
      icon: <FaUserCheck size={20} />,
      badge: pendingCount > 0 ? pendingCount : null,
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-[#0a0612]/90 backdrop-blur-xl border-r border-white/5 pt-24 px-4 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col justify-between`}
    >
      <div className="space-y-6 flex-grow">
        {/* Navigation Items */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                } relative group`}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                
                {/* Badge for approvals */}
                {item.badge && (
                  <span className={`absolute right-4 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ${!isOpen && "top-2 right-2"}`}>
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Hover Tooltip */}
                {!isOpen && (
                  <div className="absolute left-24 px-3 py-1.5 bg-black/90 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl border border-white/10 z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation */}
      <div className="py-6 border-t border-white/5 space-y-2">
        <Link
          to="/setting"
          className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${
            location.pathname === "/setting"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          } relative group`}
        >
          <FaCog size={22} className="flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">Settings</span>}
          {!isOpen && (
            <div className="absolute left-24 px-3 py-1.5 bg-black/90 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl border border-white/10 z-50">
              Settings
            </div>
          )}
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 relative group text-left"
        >
          <FaSignOutAlt size={22} className="flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
          {!isOpen && (
            <div className="absolute left-24 px-3 py-1.5 bg-black/90 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl border border-white/10 z-50">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
