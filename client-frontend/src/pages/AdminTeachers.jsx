import { useEffect, useState } from "react";
import axios from "axios";
import { FaChalkboardTeacher, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaEye, FaTimes, FaCalendarAlt, FaEnvelope, FaBriefcase, FaGraduationCap, FaPhoneAlt, FaUniversity } from "react-icons/fa";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTeachers, setTotalTeachers] = useState(0);

  // Selected Teacher Modal State
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL;

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/admin/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search,
          department,
          sortBy,
          sortOrder,
          page,
          limit,
        },
      });
      setTeachers(res.data.teachers);
      setTotalPages(res.data.totalPages);
      setTotalTeachers(res.data.total);
      setLoading(false);
    } catch (err) {
      console.error("Fetch teachers error:", err);
      toast.error("Failed to load teachers list");
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add("admin-view");
    fetchTeachers();
    return () => {
      document.body.classList.remove("admin-view");
    };
  }, [search, department, sortBy, sortOrder, page]);

  const handleDelete = async (teacherId) => {
    if (!window.confirm("Are you sure you want to permanently delete this teacher record? This will also remove all their active classes and related student course enrollments.")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/api/admin/teachers/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Teacher deleted successfully");
      fetchTeachers();
    } catch (err) {
      console.error("Delete teacher error:", err);
      toast.error(err.response?.data?.message || "Failed to delete teacher");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset page on search
  };

  const handleDeptChange = (e) => {
    setDepartment(e.target.value);
    setPage(1); // Reset page on filter
  };

  const departmentsList = [
    "Computer Science",
    "Information Technology",
    "Software Engineering",
    "Business Administration",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Mathematics",
    "Physics",
  ];

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
                <FaChalkboardTeacher className="text-purple-400" size={24} />
              </span>
              Teacher Directory
            </h1>
            <p className="text-sm text-gray-500 mt-2">Manage and view qualifications of all registered educators in the system.</p>
          </div>

          {/* Filter Bar */}
          <div className="bg-black/30 border border-white/5 rounded-3xl p-6 mb-8 backdrop-blur-md flex flex-wrap gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-grow max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search teachers by name or email..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:border-purple-500/50 focus:bg-white/10 transition-all outline-none text-gray-200 placeholder:text-gray-600 text-sm font-medium"
              />
            </div>

            {/* Selects */}
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              {/* Department Filter */}
              <select
                value={department}
                onChange={handleDeptChange}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-300 outline-none cursor-pointer focus:border-purple-500/50"
              >
                <option value="" className="bg-[#0f0a1d]">All Departments</option>
                {departmentsList.map((dept) => (
                  <option key={dept} value={dept} className="bg-[#0f0a1d]">{dept}</option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-300 outline-none cursor-pointer focus:border-purple-500/50"
              >
                <option value="createdAt" className="bg-[#0f0a1d]">Register Date</option>
                <option value="name" className="bg-[#0f0a1d]">Name</option>
                <option value="email" className="bg-[#0f0a1d]">Email</option>
              </select>

              {/* Sort Order */}
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-300 outline-none cursor-pointer focus:border-purple-500/50"
              >
                <option value="desc" className="bg-[#0f0a1d]">Newest First</option>
                <option value="asc" className="bg-[#0f0a1d]">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Teacher Table */}
          <div className="bg-black/20 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
            {loading ? (
              <div className="py-24 text-center">
                <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm mt-3 animate-pulse">Loading records...</p>
              </div>
            ) : teachers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5 text-gray-400 font-semibold text-xs uppercase tracking-wider">
                      <th className="py-4 px-6">Avatar</th>
                      <th className="py-4 px-6">Teacher Info</th>
                      <th className="py-4 px-6">Qualification</th>
                      <th className="py-4 px-6">Department</th>
                      <th className="py-4 px-6">Joined Date</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {teachers.map((teacher) => (
                      <tr key={teacher._id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-sm shadow-sm">
                            {teacher.name.charAt(0).toUpperCase()}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <h4 className="text-sm font-bold text-white">{teacher.name}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{teacher.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-300 font-medium">
                          {teacher.qualification || "Not Provided"}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-300">
                          {teacher.department || "General / Undeclared"}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {new Date(teacher.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedTeacher(teacher)}
                              className="p-2 bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-purple-500/10 text-purple-400 rounded-xl transition-all duration-300"
                              title="View Details"
                            >
                              <FaEye size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(teacher._id)}
                              className="p-2 bg-white/5 border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-red-400 rounded-xl transition-all duration-300"
                              title="Delete Teacher"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-24 text-center">
                <p className="text-gray-500 text-sm">No teacher records found matching the criteria.</p>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="py-4 px-6 border-t border-white/5 bg-white/5 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Showing <span className="font-semibold text-white">{teachers.length}</span> of{" "}
                  <span className="font-semibold text-white">{totalTeachers}</span> teachers
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="p-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-gray-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft size={12} />
                  </button>
                  <span className="text-xs text-gray-400 px-3 font-semibold">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="p-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-gray-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Detail Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f0a1c] border border-white/10 w-full max-w-[550px] rounded-3xl overflow-hidden shadow-2xl relative animate-zoomIn">
            
            {/* Modal Header */}
            <div className="relative h-32 bg-gradient-to-r from-purple-800 to-indigo-800 p-6 flex items-end">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 p-2 rounded-full text-white/80 hover:text-white transition-colors"
              >
                <FaTimes size={16} />
              </button>
              <div className="flex items-center gap-4 translate-y-12">
                <div className="w-20 h-20 rounded-2xl bg-[#0f0a1c] border-4 border-[#0f0a1c] shadow-lg flex items-center justify-center text-3xl font-black text-purple-400 bg-purple-900/20">
                  {selectedTeacher.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white leading-tight">{selectedTeacher.name}</h3>
                  <span className="bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-cyan-300 uppercase tracking-wide">
                    Teacher
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="pt-16 p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase flex items-center gap-1.5 mb-1">
                    <FaGraduationCap /> Qualification
                  </p>
                  <p className="text-sm font-bold text-white">{selectedTeacher.qualification || "Not Provided"}</p>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase flex items-center gap-1.5 mb-1">
                    <FaBriefcase /> Experience
                  </p>
                  <p className="text-sm font-bold text-white">
                    {selectedTeacher.experience ? `${selectedTeacher.experience} Years` : "Not Provided"}
                  </p>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 col-span-2">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase flex items-center gap-1.5 mb-1">
                    <FaEnvelope /> Email Address
                  </p>
                  <p className="text-sm font-bold text-white">{selectedTeacher.email}</p>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase flex items-center gap-1.5 mb-1">
                    <FaUniversity /> Department
                  </p>
                  <p className="text-sm font-bold text-white">{selectedTeacher.department || "General / Undeclared"}</p>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase flex items-center gap-1.5 mb-1">
                    <FaPhoneAlt /> Phone / Contact
                  </p>
                  <p className="text-sm font-bold text-white">{selectedTeacher.contact || "Not Provided"}</p>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 col-span-2">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase flex items-center gap-1.5 mb-1">
                    <FaCalendarAlt /> Joined Date
                  </p>
                  <p className="text-sm font-bold text-white">
                    {new Date(selectedTeacher.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white/5 border-t border-white/5 flex justify-end gap-3">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
