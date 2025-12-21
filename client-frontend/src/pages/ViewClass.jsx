import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VscFileSymlinkDirectory } from "react-icons/vsc";
import { RiLinkM, RiUser3Fill } from "react-icons/ri";
import {
  MdDelete,
  MdEmail,
  MdGroups,
  MdStream,
  MdDownload,
} from "react-icons/md";
import { FaRegEdit, FaRocket, FaShare, FaGraduationCap } from "react-icons/fa";
import { IoSparkles, IoSettings, IoPeople } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AnnouncementModal from "../components/AnnouncementModal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useBackgrounds } from "../context/BackgroundContext";
import "../styles/ViewClass.css";

const CombinedViewClass = () => {
  const { classID } = useParams();
  const navigate = useNavigate();

  // Check if it's student or teacher view based on URL
  const isStudentView = window.location.pathname.includes("/student/class/");
  const isTeacherView = window.location.pathname.includes("/view-class/");

  const [classData, setClassData] = useState({});
  const [allContent, setAllContent] = useState([]);
  const [showModal, setShowModal] = useState({ open: false, editData: null });
  const [menuOpen, setMenuOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [activeTab, setActiveTab] = useState("stream");
  const [people, setPeople] = useState([]); // Students for teacher, classmates for student

  const { getBackground } = useBackgrounds();
  const background = getBackground(classData._id);
  const API_BASE = import.meta.env.VITE_API_URL;

  // Determine user role from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role || (isStudentView ? "student" : "teacher");

  // Fetch class info based on role
  const fetchClassData = async () => {
    const token = localStorage.getItem("token");
    try {
      let endpoint = "";

      if (isStudentView || userRole === "student") {
        endpoint = `${API_BASE}/api/students/details/${classID}`;
      } else {
        endpoint = `${API_BASE}/api/subject/${classID}`;
      }

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassData(res.data);
    } catch (error) {
      console.error("Error fetching class data:", error.message);
      toast.error("Failed to load class data");
    }
  };

  // Fetch people list based on role
  const fetchPeople = async () => {
    const token = localStorage.getItem("token");
    try {
      let endpoint = "";

      if (isStudentView || userRole === "student") {
        endpoint = `${API_BASE}/api/students/students/${classID}`;
      } else {
        endpoint = `${API_BASE}/api/students/students/${classID}`;
      }

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.students || [];
      setPeople(data);
    } catch (error) {
      console.error("Error fetching people:", error.message);
    }
  };

  // Fetch posted content
  const fetchClassContent = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/content/${classID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllContent(res.data);
    } catch (error) {
      console.error("Error fetching content:", error.message);
      toast.error("Failed to load class content");
    } finally {
      setLoading(false);
    }
  };

  // Create or update announcement (teacher only)
  const handleAnnouncementSubmit = async (
    idOrFormData,
    isEdit = false,
    formData = null
  ) => {
    if (isStudentView || userRole === "student") {
      toast.error("Students cannot create announcements");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      if (isEdit) {
        await axios.put(`${API_BASE}/api/content/${idOrFormData}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(`${API_BASE}/api/content`, idOrFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      fetchClassContent();
    } catch (err) {
      console.error(err);
      toast.error("Operation failed!");
    }
  };

  // Delete content (teacher only)
  const handleDelete = async (id) => {
    if (isStudentView || userRole === "student") {
      toast.error("Students cannot delete content");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/content/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchClassContent();
      toast.success("Content deleted successfully!");
    } catch (error) {
      console.error("Error deleting content:", error.message);
      toast.error("Failed to delete content.");
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchClassData();
    fetchClassContent();
    fetchPeople();
  }, [classID]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-6 border-4 border-cyan-500 border-b-transparent rounded-full animate-spin-slow"></div>
          </div>
          <p className="text-white text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            Loading class content...
          </p>
        </div>
      </div>
    );
  }

  // Determine colors based on role
  const primaryGradientFrom = isStudentView
    ? "var(--student-primary-from)"
    : "var(--teacher-primary-from)";
  const primaryGradientTo = isStudentView
    ? "var(--student-primary-to)"
    : "var(--teacher-primary-to)";
  const accentColor = isStudentView
    ? "var(--student-accent)"
    : "var(--teacher-accent)";
  const accentDark = isStudentView
    ? "var(--student-accent-dark)"
    : "var(--teacher-accent-dark)";
  const secondaryAccentColor = isStudentView
    ? "var(--student-secondary-accent)"
    : "var(--teacher-secondary-accent)";
  const secondaryAccentDark = isStudentView
    ? "var(--student-secondary-accent-dark)"
    : "var(--teacher-secondary-accent-dark)";
  const tabGradientFrom = isStudentView
    ? "var(--student-tab-from)"
    : "var(--teacher-tab-from)";
  const tabGradientTo = isStudentView
    ? "var(--student-tab-to)"
    : "var(--teacher-tab-to)";

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--bg-color)]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-300 dark:bg-cyan-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar
        onCreateClick={
          isStudentView
            ? null
            : () => setShowModal({ open: true, editData: null })
        }
        onSidebarToggle={toggleSidebar}
      />

      <div className="flex pt-16">
        <Sidebar
          isOpen={isSidebarOpen}
          onCreateClick={
            isStudentView
              ? null
              : () => setShowModal({ open: true, editData: null })
          }
        />

        <div className="header-section max-w-full mt-8 p-6 md:mr-16 sm:mr-1 flex-1 ml-0 lg:ml-64 transition-all duration-300">
          {/* Header Section */}
          <div
            className="relative text-white lg:p-12 rounded-3xl p-8 border border-slate-200 dark:border-slate-700"
            style={{
              background: `linear-gradient(to right, ${primaryGradientFrom}, ${primaryGradientTo})`,
            }}
          >
            <div className="absolute inset-0"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex-1 w-full">
                  {/* Status Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[var(--light-text)] text-sm md:text-base font-medium">
                      {isStudentView ? "Currently Enrolled" : "Active Class"}
                    </span>
                  </div>

                  {/* Subject Title */}
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-3 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent leading-tight">
                    {classData?.subject}
                  </h1>

                  {/* Program Name */}
                  <p className="text-lg md:text-xl text-white/80 mb-6">
                    {classData?.program}
                  </p>

                  {/* Stats Cards Container */}
                  <div className="flex flex-wrap gap-3 md:gap-4">
                    {!isStudentView && classData?.code && (
                      <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl px-4 py-2 md:px-6 md:py-3 border border-white/20 flex-1 min-w-[140px] sm:flex-none">
                        <p className="text-[10px] md:text-sm text-white/70 font-medium uppercase tracking-wider">
                          Class Code
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <code className="text-lg md:text-2xl font-black text-white">
                            {classData?.code}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(classData?.code);
                              toast.success("Class code copied! 📋");
                            }}
                            className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                          >
                            <FaShare className="text-white text-xs md:text-sm" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Members Stat */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl px-4 py-2 md:px-6 md:py-3 border border-white/20 flex-1 min-w-[100px] sm:flex-none">
                      <p className="text-[10px] md:text-sm text-white/70 font-medium uppercase tracking-wider">
                        {isStudentView ? "Classmates" : "Students"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <IoPeople className="text-lg md:text-xl text-white/80" />
                        <span className="text-lg md:text-2xl font-black text-white">
                          {people.length}
                        </span>
                      </div>
                    </div>

                    {/* Materials Stat (Student Only) */}
                    {isStudentView && (
                      <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl px-4 py-2 md:px-6 md:py-3 border border-white/20 flex-1 min-w-[100px] sm:flex-none">
                        <p className="text-[10px] md:text-sm text-white/70 font-medium uppercase tracking-wider">
                          Materials
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <MdDownload className="text-lg md:text-xl text-white/80" />
                          <span className="text-lg md:text-2xl font-black text-white">
                            {
                              allContent.filter(
                                (item) => item.fileUrl || item.linkUrl
                              ).length
                            }
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side Action / Badge */}
                <div className="w-full lg:w-auto mt-2 lg:mt-0">
                  {isStudentView ? (
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 lg:bg-transparent lg:p-0 lg:border-none lg:justify-end">
                      <div
                        className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0"
                        style={{
                          background: `linear-gradient(to right, ${secondaryAccentColor}, ${secondaryAccentDark})`,
                        }}
                      >
                        <FaGraduationCap className="text-white text-xl md:text-2xl" />
                      </div>
                      <div className="text-left lg:text-right">
                        <p className="text-xs md:text-sm text-white/60">
                          Enrolled as
                        </p>
                        <p className="text-lg md:text-xl font-bold text-white leading-none mt-1">
                          Student
                        </p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        setShowModal({ open: true, editData: null })
                      }
                      className="w-full lg:w-auto group bg-white text-cyan-600 px-6 py-4 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-xl flex items-center justify-center gap-3"
                    >
                      <IoSparkles className="group-hover:rotate-180 transition-transform duration-500 text-xl" />
                      New Announcement
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-full p-4 md:p-6 rounded-2xl md:rounded-3xl mt-4 md:mt-8 mb-12 shadow-xl border border-slate-200 dark:border-slate-700">
            {/* Tabs - Fixed for Mobile */}
            <div className="bg-[var(--card-bg)] rounded-2xl md:rounded-3xl p-1.5 md:p-2 mb-6 md:mb-8 shadow-xl border border-[var(--border-color)] flex flex-row w-full sm:w-auto sm:inline-flex">
              <button
                onClick={() => setActiveTab("stream")}
                className={`flex items-center justify-center flex-1 sm:flex-none gap-2 md:gap-3 px-3 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg transition-all duration-300 ${
                  activeTab === "stream"
                    ? "text-white shadow-lg"
                    : "text-[var(--text-color)]"
                }`}
                style={
                  activeTab === "stream"
                    ? {
                        background: `linear-gradient(to right, ${tabGradientFrom}, ${tabGradientTo})`,
                      }
                    : {}
                }
              >
                <MdStream className="text-lg md:text-xl" />
                <span className="whitespace-nowrap">
                  {isStudentView ? "Stream" : "Stream"}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("people")}
                className={`flex items-center justify-center flex-1 sm:flex-none gap-2 md:gap-3 px-3 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg transition-all duration-300 ${
                  activeTab === "people"
                    ? "text-white shadow-lg"
                    : "text-[var(--text-color)]"
                }`}
                style={
                  activeTab === "people"
                    ? {
                        background: `linear-gradient(to right, ${secondaryAccentColor}, ${secondaryAccentDark})`,
                      }
                    : {}
                }
              >
                <MdGroups className="text-lg md:text-xl" />
                <span className="whitespace-nowrap">({people.length})</span>
              </button>
            </div>

            {/* Stream Tab */}
            {activeTab === "stream" && (
              <div className="space-y-4 md:y-6">
                {/* Quick Stats - Optimized for Mobile Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {[
                    {
                      label: isStudentView ? "Posts" : "Total Posts",
                      val: allContent.length,
                      icon: <IoSparkles />,
                      grad: "from-green-400 to-emerald-500",
                    },
                    {
                      label: "Resources",
                      val: allContent.filter((i) => i.fileUrl || i.linkUrl)
                        .length,
                      icon: <VscFileSymlinkDirectory />,
                      grad: "from-blue-400 to-cyan-500",
                    },
                    {
                      label: "Activity",
                      val: isStudentView ? "Active" : "High",
                      icon: <FaRocket />,
                      grad: "from-purple-400 to-pink-500",
                    },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-[var(--card-bg)] rounded-2xl p-4 md:p-6 border border-[var(--border-color)] shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${stat.grad} rounded-xl md:rounded-2xl flex items-center justify-center text-white text-lg md:text-xl`}
                        >
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-[var(--muted-text)] text-xs md:text-sm">
                            {stat.label}
                          </p>
                          <p className="text-xl md:text-2xl font-black text-[var(--text-color)]">
                            {stat.val}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Content Section */}
                <div className="bg-[var(--bg-content-color)] rounded-2xl md:rounded-3xl p-4 md:p-8 border border-[var(--border-color)] shadow-xl">
                  <h2 className="text-xl md:text-3xl font-black text-[var(--text-color)] mb-6 md:mb-8 flex items-center gap-3">
                    <div
                      className="w-1.5 h-6 md:w-2 md:h-8 rounded-full"
                      style={{
                        background: `linear-gradient(to bottom, ${accentColor}, ${accentDark})`,
                      }}
                    ></div>
                    {isStudentView ? "Materials" : "Announcements"}
                  </h2>

                  {allContent.length === 0 ? (
                    <div className="text-center py-10 md:py-16">
                      <IoSparkles className="text-4xl md:text-6xl text-[var(--muted-text)] mx-auto mb-4 opacity-20" />
                      <h3 className="text-lg md:text-2xl font-bold text-[var(--muted-text)]">
                        Empty Stream
                      </h3>
                    </div>
                  ) : (
                    <div className="space-y-4 md:space-y-6">
                      {allContent.map((item) => (
                        <div
                          key={item._id}
                          className="bg-[var(--card-bg)] rounded-xl md:rounded-2xl p-4 md:p-6 border border-[var(--border-color)]"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3 md:gap-4">
                              <div
                                className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-2xl flex items-center justify-center text-white font-bold text-base md:text-lg"
                                style={{
                                  background: `linear-gradient(to right, ${accentColor}, ${accentDark})`,
                                }}
                              >
                                {item.teacherID?.name?.charAt(0) || "T"}
                              </div>
                              <div>
                                <h4 className="font-bold text-[var(--text-color)] text-sm md:text-lg">
                                  {item.teacherID?.name || "Teacher"}
                                </h4>
                                <p className="text-[var(--muted-text)] text-[10px] md:text-sm">
                                  {formatDate(item.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                          {item.text && (
                            <p className="text-[var(--text-color)] text-sm md:text-lg mb-4">
                              {item.text}
                            </p>
                          )}

                          {/* Responsive Links/Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2">
                            {item.fileUrl && (
                              <a
                                href={`${API_BASE}/${item.fileUrl}`}
                                target="_blank"
                                className="flex items-center gap-2 bg-[var(--hover-bg)] p-2 md:px-4 md:py-3 rounded-lg border text-xs md:text-sm font-medium"
                              >
                                <VscFileSymlinkDirectory
                                  style={{ color: accentColor }}
                                />{" "}
                                Attachment
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* People Tab */}
            {activeTab === "people" && (
              <div className="bg-[var(--content-bg)] rounded-2xl md:rounded-3xl p-4 md:p-8 border border-[var(--border-color)]">
                <h2 className="text-xl md:text-3xl font-black text-[var(--text-color)] mb-6 md:mb-8 flex items-center gap-3">
                  <div
                    className="w-1.5 h-6 md:w-2 md:h-8 rounded-full"
                    style={{
                      background: `linear-gradient(to bottom, ${secondaryAccentColor}, ${secondaryAccentDark})`,
                    }}
                  ></div>
                  Classmates ({people.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {people.map((person) => (
                    <div
                      key={person._id}
                      className="bg-[var(--card-bg)] rounded-xl p-4 border border-[var(--border-color)] flex flex-col items-center text-center"
                    >
                      <div
                        className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-white font-bold mb-3"
                        style={{
                          background: `linear-gradient(to right, ${secondaryAccentColor}, ${secondaryAccentDark})`,
                        }}
                      >
                        {person.name?.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="font-bold text-[var(--text-color)] text-sm md:text-base mb-1">
                        {person.name}
                      </h3>
                      <p className="text-[var(--muted-text)] text-[10px] md:text-xs mb-4 truncate w-full">
                        {person.email}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(person.email);
                          toast.success("Copied!");
                        }}
                        className="w-full bg-[var(--hover-bg)] py-2 rounded-lg text-xs font-bold"
                      >
                        Copy Email
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals (teacher only) */}
      {showModal.open && !isStudentView && (
        <AnnouncementModal
          onClose={() => setShowModal({ open: false, editData: null })}
          onSubmit={handleAnnouncementSubmit}
          classID={classID}
          editData={showModal.editData}
        />
      )}

      <ConfirmDialog
        show={showConfirm}
        onConfirm={() => handleDelete(deleteId)}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default CombinedViewClass;
