import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCheck, FaUserTimes, FaCheck, FaTimes, FaShieldAlt, FaClock, FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminApprovals() {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL;

  const fetchPendingAdmins = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/admin/pending-admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingAdmins(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch pending admins error:", err.response?.status, err.response?.data || err.message);
      toast.error("Failed to load pending admin requests");
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add("admin-view");
    fetchPendingAdmins();
    return () => {
      document.body.classList.remove("admin-view");
    };
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await axios.put(`${API_BASE}/api/admin/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message || "Administrator approved successfully", { theme: "dark" });
      fetchPendingAdmins();
    } catch (err) {
      console.error("Approve admin error:", err);
      toast.error(err.response?.data?.message || "Failed to approve admin request");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this administrator access request?")) {
      return;
    }

    try {
      const res = await axios.put(`${API_BASE}/api/admin/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message || "Administrator request rejected", { theme: "dark" });
      fetchPendingAdmins();
    } catch (err) {
      console.error("Reject admin error:", err);
      toast.error(err.response?.data?.message || "Failed to reject admin request");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
          
          {/* Section Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span className="p-3 bg-purple-600/15 border border-purple-500/30 rounded-2xl">
                <FaUserShield className="text-purple-400" size={24} />
              </span>
              Security & Approvals
            </h1>
            <p className="text-sm text-gray-500 mt-2">Grant or reject administrative credentials for new administration team signups.</p>
          </div>

          {/* Pending List Card */}
          <div className="bg-black/20 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FaShieldAlt className="text-purple-500" />
                Pending Authorizations ({pendingAdmins.length})
              </h3>
              <span className="text-xs text-gray-500 font-medium">Authorizations require explicit review</span>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm mt-3 animate-pulse">Checking credentials...</p>
              </div>
            ) : pendingAdmins.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingAdmins.map((admin) => (
                  <div
                    key={admin._id}
                    className="p-6 rounded-3xl bg-[#0e091a]/40 border border-white/5 hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-600/20 border border-purple-500/30 rounded-2xl flex items-center justify-center text-purple-300 font-black text-lg shadow-sm">
                            {admin.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-base font-extrabold text-white">{admin.name}</h4>
                            <p className="text-xs text-gray-500 font-light mt-0.5">{admin.email}</p>
                          </div>
                        </div>
                        <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                          <FaClock className="animate-spin-slow" /> Pending
                        </div>
                      </div>

                      <div className="space-y-2.5 text-xs text-gray-400 border-t border-white/5 pt-4 mb-6">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-500">Proposed Role:</span>
                          <span className="text-white font-medium uppercase">SYSTEM ADMINISTRATOR</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-500">Sign Up Date:</span>
                          <span className="text-gray-300 font-medium">
                            {new Date(admin.createdAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(admin._id)}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition-all duration-300 shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2"
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(admin._id)}
                        className="flex-1 bg-white/5 border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-gray-400 hover:text-red-400 font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border border-dashed border-white/5 rounded-3xl bg-white/5">
                <div className="w-16 h-16 bg-purple-600/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mx-auto mb-4">
                  <FaShieldAlt size={28} />
                </div>
                <h4 className="text-base font-bold text-white mb-1">Queue is Empty</h4>
                <p className="text-sm text-gray-500">No new administrative credential requests are pending review.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
