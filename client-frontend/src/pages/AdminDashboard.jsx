import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaUserShield, FaClock } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeAdmins, setActiveAdmins] = useState([]);

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Set theme to admin
    document.body.classList.add("admin-view");
    document.body.classList.remove("student-view", "teacher-view");

    const fetchStats = async () => {
      try {
        const resStats = await axios.get(`${API_BASE}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(resStats.data);

        const resAdmins = await axios.get(`${API_BASE}/api/admin/admins`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActiveAdmins(resAdmins.data);

        setLoading(false);
      } catch (err) {
        console.error("Dashboard stats error:", err);
        toast.error("Failed to load dashboard metrics");
        setLoading(false);
      }
    };

    fetchStats();

    return () => {
      document.body.classList.remove("admin-view");
    };
  }, [token]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0612] flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-6 border-4 border-indigo-500 border-b-transparent rounded-full animate-spin-slow"></div>
          </div>
          <p className="text-white text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
            Configuring Administrative Space...
          </p>
        </div>
      </div>
    );
  }

  // Cards configuration
  const cardData = [
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      recent: `+${stats?.recentStudents || 0} this week`,
      icon: <FaUserGraduate size={24} className="text-purple-400" />,
      color: "from-purple-600/10 to-indigo-600/10 border-purple-500/20",
    },
    {
      title: "Total Teachers",
      value: stats?.totalTeachers || 0,
      recent: `+${stats?.recentTeachers || 0} this week`,
      icon: <FaChalkboardTeacher size={24} className="text-cyan-400" />,
      color: "from-cyan-600/10 to-blue-600/10 border-cyan-500/20",
    },
    {
      title: "Total Classes",
      value: stats?.totalClasses || 0,
      recent: "Active standard subjects",
      icon: <FaBook size={22} className="text-pink-400" />,
      color: "from-pink-600/10 to-rose-600/10 border-pink-500/20",
    },
    {
      title: "Pending Approvals",
      value: stats?.pendingAdmins || 0,
      recent: stats?.pendingAdmins > 0 ? "Requires review" : "Up to date",
      icon: <FaUserShield size={24} className={stats?.pendingAdmins > 0 ? "text-red-400 animate-pulse" : "text-emerald-400"} />,
      color: stats?.pendingAdmins > 0 
        ? "from-red-600/10 to-orange-600/10 border-red-500/30" 
        : "from-emerald-600/10 to-teal-600/10 border-emerald-500/20",
    },
  ];

  // Max count in department for scaling chart
  const maxDeptCount = stats?.departmentStats?.length > 0 
    ? Math.max(...stats.departmentStats.map(d => d.count)) 
    : 1;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050209] text-gray-200">
      
      {/* Background ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[150px]"></div>
      </div>

      <Navbar onSidebarToggle={toggleSidebar} />

      <div className="flex pt-16 relative z-10">
        <AdminSidebar isOpen={isSidebarOpen} />

        <div className={`main-section flex-1 p-6 md:p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
          
          {/* Welcome Banner */}
          <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-black/40 border border-white/5 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold text-purple-300 tracking-wider">
                <IoSparkles />
                ADMINISTRATION PANEL
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
                System Overview
              </h1>
              <p className="text-gray-400 font-light text-base max-w-xl">
                Monitor records, review pending admin registrations, and view analytics of teachers, students, and classes.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-black/30 border border-white/5 rounded-2xl p-4 self-start md:self-auto backdrop-blur-md">
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                <FaUserShield className="text-purple-300" size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Logged in as</p>
                <h4 className="text-sm font-semibold text-white">Super Admin</h4>
              </div>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {cardData.map((card, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${card.color} border backdrop-blur-md rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between h-40`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">{card.title}</p>
                    <h2 className="text-3xl font-black text-white">{card.value}</h2>
                  </div>
                  <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                    {card.icon}
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5 pt-4 border-t border-white/5">
                  <FaClock className="text-gray-600" />
                  {card.recent}
                </div>
              </div>
            ))}
          </div>

          {/* Charts and Lists Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Department Distribution (Pure CSS Custom Chart) */}
            <div className="lg:col-span-2 bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Department Registration</h3>
                <p className="text-xs text-gray-500 mb-6">Staff and student counts across various departments</p>
                
                <div className="space-y-5">
                  {stats?.departmentStats && stats.departmentStats.length > 0 ? (
                    stats.departmentStats.map((dept) => {
                      const percentage = Math.round((dept.count / maxDeptCount) * 100);
                      return (
                        <div key={dept._id} className="group">
                          <div className="flex justify-between text-sm font-medium mb-1.5">
                            <span className="text-gray-300 group-hover:text-white transition-colors">{dept._id}</span>
                            <span className="text-purple-400 font-bold">{dept.count} members</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/5">
                            <div 
                              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-1000 group-hover:from-purple-500 group-hover:to-indigo-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-48 flex items-center justify-center text-gray-600 text-sm font-light border border-dashed border-white/5 rounded-2xl">
                      No department data available
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Distribution shows absolute numbers</span>
                <span className="text-purple-400">EduFuture System</span>
              </div>
            </div>

            {/* Active System Administrators */}
            <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Active Administrators</h3>
                <p className="text-xs text-gray-500 mb-6">Staff users with complete system access</p>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {activeAdmins.length > 0 ? (
                    activeAdmins.map((admin) => (
                      <div key={admin._id} className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-base shadow-sm">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-grow">
                          <h4 className="text-sm font-bold text-white truncate">{admin.name}</h4>
                          <p className="text-xs text-gray-500 truncate">{admin.email}</p>
                        </div>
                        <div className="flex-shrink-0 bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full uppercase">
                          Active
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-600 text-sm border border-dashed border-white/5 rounded-2xl">
                      No other active administrators found
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex justify-center">
                <p className="text-[10px] text-gray-600 font-medium flex items-center gap-1">
                  <FaUserShield /> Authorized accounts only
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
