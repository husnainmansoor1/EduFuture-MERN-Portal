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

        <div className="header-section max-w-full mt-8 p-6 mr-16 flex-1 ml-0 lg:ml-64 transition-all duration-300">
          {/* Header Section */}
          <div
            className="relative text-white lg:p-12 rounded-3xl p-8 border border-slate-200 dark:border-slate-700"
            style={{
              background: `linear-gradient(to right, ${primaryGradientFrom}, ${primaryGradientTo})`,
            }}
          >
            <div className="absolute inset-0"></div>
            <div className="relative z-10 max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[var(--light-text)] font-medium">
                      {isStudentView ? "Currently Enrolled" : "Active Class"}
                    </span>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-white to-[var(--light-text)] bg-clip-text text-transparent">
                    {classData?.subject}
                  </h1>
                  <p className="text-xl text-[var(--light-text)] mb-6">
                    {classData?.program}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    {!isStudentView && classData?.code && (
                      <div className="bg-white/20 backdrop-blur-lg rounded-2xl px-6 py-3 border border-white/30">
                        <p className="text-sm text-[var(--light-text)] font-medium">
                          Class Code
                        </p>
                        <div className="flex items-center gap-3">
                          <code className="text-2xl font-black text-white">
                            {classData?.code}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(classData?.code);
                              toast.success(
                                "Class code copied to clipboard! 📋"
                              );
                            }}
                            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                          >
                            <FaShare className="text-white" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="bg-white/20 backdrop-blur-lg rounded-2xl px-6 py-3 border border-white/30">
                      <p className="text-sm text-[var(--light-text)] font-medium">
                        {isStudentView ? "Classmates" : "Students"}
                      </p>
                      <div className="flex items-center gap-2">
                        <IoPeople className="text-xl" />
                        <span className="text-2xl font-black text-white">
                          {people.length}
                        </span>
                      </div>
                    </div>

                    {isStudentView && (
                      <div className="bg-white/20 backdrop-blur-lg rounded-2xl px-6 py-3 border border-white/30">
                        <p className="text-sm text-[var(--light-text)] font-medium">
                          Materials
                        </p>
                        <div className="flex items-center gap-2">
                          <MdDownload className="text-xl" />
                          <span className="text-2xl font-black text-white">
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

                {isStudentView ? (
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(to right, ${secondaryAccentColor}, ${secondaryAccentDark})`,
                      }}
                    >
                      <FaGraduationCap className="text-white text-2xl" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--light-text)]">
                        Enrolled as
                      </p>
                      <p className="text-xl font-bold text-white">Student</p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowModal({ open: true, editData: null })}
                    className="group bg-white text-cyan-600 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 flex items-center gap-3"
                  >
                    <IoSparkles className="group-hover:rotate-180 transition-transform duration-500" />
                    New Announcement
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-full p-6 rounded-3xl mt-8 mb-12 shadow-xl border border-slate-200 dark:border-slate-700">
            {/* Tabs */}
            <div className="bg-[var(--card-bg)] rounded-3xl p-2 mb-8 shadow-xl border border-[var(--border-color)] inline-flex">
              <button
                onClick={() => setActiveTab("stream")}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  activeTab === "stream"
                    ? "text-white shadow-lg"
                    : "text-[var(--text-color)] hover:text-[var(--accent-color)]"
                }`}
                style={
                  activeTab === "stream"
                    ? {
                        background: `linear-gradient(to right, ${tabGradientFrom}, ${tabGradientTo})`,
                      }
                    : {}
                }
              >
                <MdStream className="text-xl" />
                {isStudentView ? "Class Stream" : "Stream"}
              </button>
              <button
                onClick={() => setActiveTab("people")}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  activeTab === "people"
                    ? "text-white shadow-lg"
                    : "text-[var(--text-color)] hover:text-[var(--secondary-accent-color)]"
                }`}
                style={
                  activeTab === "people"
                    ? {
                        background: `linear-gradient(to right, ${secondaryAccentColor}, ${secondaryAccentDark})`,
                      }
                    : {}
                }
              >
                <MdGroups className="text-xl" />
                {isStudentView ? "Classmates" : "People"} ({people.length})
              </button>
            </div>

            {/* Stream Tab */}
            {activeTab === "stream" && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-color)] shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                        <IoSparkles className="text-white text-xl" />
                      </div>
                      <div>
                        <p className="text-[var(--muted-text)] text-sm">
                          {isStudentView
                            ? "Total Announcements"
                            : "Total Posts"}
                        </p>
                        <p className="text-2xl font-black text-[var(--text-color)]">
                          {allContent.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-color)] shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center">
                        <VscFileSymlinkDirectory className="text-white text-xl" />
                      </div>
                      <div>
                        <p className="text-[var(--muted-text)] text-sm">
                          Resources
                        </p>
                        <p className="text-2xl font-black text-[var(--text-color)]">
                          {
                            allContent.filter(
                              (item) => item.fileUrl || item.linkUrl
                            ).length
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-color)] shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
                        <FaRocket className="text-white text-xl" />
                      </div>
                      <div>
                        <p className="text-[var(--muted-text)] text-sm">
                          Activity
                        </p>
                        <p className="text-2xl font-black text-[var(--text-color)]">
                          {isStudentView ? "Participating" : "High"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="bg-[var(--bg-content-color)] rounded-3xl p-8 border border-[var(--border-color)] shadow-xl">
                  <h2 className="text-3xl font-black text-[var(--text-color)] mb-8 flex items-center gap-3">
                    <div
                      className="w-2 h-8 rounded-full"
                      style={{
                        background: `linear-gradient(to bottom, ${accentColor}, ${accentDark})`,
                      }}
                    ></div>
                    {isStudentView
                      ? "Learning Materials"
                      : "Class Announcements"}
                  </h2>

                  {allContent.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-r from-[var(--hover-bg)] to-[var(--card-bg)] rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <IoSparkles className="text-4xl text-[var(--muted-text)]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[var(--muted-text)] mb-3">
                        {isStudentView
                          ? "No materials yet"
                          : "No announcements yet"}
                      </h3>
                      <p className="text-[var(--muted-text)] mb-6">
                        {isStudentView
                          ? "Your teacher will post materials here soon"
                          : "Be the first to share something with the class"}
                      </p>
                      {!isStudentView && (
                        <button
                          onClick={() =>
                            setShowModal({ open: true, editData: null })
                          }
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                          Create First Post
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {allContent
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        )
                        .map((item) => (
                          <div
                            key={item._id}
                            className="group bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-all duration-500 hover:shadow-xl"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
                                    style={{
                                      background: `linear-gradient(to right, ${accentColor}, ${accentDark})`,
                                    }}
                                  >
                                    {item.teacherID?.name?.charAt(0) || "T"}
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                  <h4 className="font-bold text-[var(--text-color)] text-lg">
                                    {item.teacherID?.name ||
                                      (isStudentView
                                        ? "Teacher"
                                        : "Unknown Teacher")}
                                  </h4>
                                  <p className="text-[var(--muted-text)] text-sm">
                                    {formatDate(item.createdAt)}
                                  </p>
                                </div>
                              </div>

                              {!isStudentView && (
                                <div className="relative">
                                  <button
                                    onClick={() =>
                                      setMenuOpen(
                                        menuOpen === item._id ? null : item._id
                                      )
                                    }
                                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                  >
                                    <IoSettings className="text-xl" />
                                  </button>

                                  {menuOpen === item._id && (
                                    <div className="absolute right-0 top-12 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-2xl z-10 overflow-hidden">
                                      <button
                                        onClick={() => {
                                          setShowModal({
                                            open: true,
                                            editData: item,
                                          });
                                          setMenuOpen(null);
                                        }}
                                        className="flex items-center gap-3 px-6 py-4 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors w-full text-left"
                                      >
                                        <FaRegEdit className="text-cyan-500" />
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => {
                                          setDeleteId(item._id);
                                          setShowConfirm(true);
                                          setMenuOpen(null);
                                        }}
                                        className="flex items-center gap-3 px-6 py-4 text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors w-full text-left"
                                      >
                                        <MdDelete />
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {item.text && (
                              <p className="text-[var(--text-color)] text-lg leading-relaxed mb-6">
                                {item.text}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-3">
                              {item.fileUrl && (
                                <a
                                  href={`${API_BASE}/${item.fileUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 bg-[var(--hover-bg)] px-4 py-3 rounded-xl border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-all duration-300 group"
                                >
                                  <VscFileSymlinkDirectory
                                    className="text-xl"
                                    style={{ color: accentColor }}
                                  />
                                  <span className="font-medium text-[var(--text-color)]">
                                    {isStudentView
                                      ? "Download Attachment"
                                      : item.fileUrl.split("/").pop()}
                                  </span>
                                </a>
                              )}
                              {item.linkUrl && (
                                <a
                                  href={item.linkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 bg-[var(--hover-bg)] px-4 py-3 rounded-xl border border-[var(--border-color)] hover:border-[var(--secondary-accent-color)] transition-all duration-300 group"
                                >
                                  <RiLinkM
                                    className="text-xl"
                                    style={{ color: secondaryAccentColor }}
                                  />
                                  <span className="font-medium text-[var(--text-color)]">
                                    {isStudentView
                                      ? "Open Resource"
                                      : "Resource Link"}
                                  </span>
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
              <div className="bg-[var(--content-bg)] rounded-3xl p-8 border border-[var(--border-color)] shadow-xl">
                <h2 className="text-3xl font-black text-[var(--text-color)] mb-8 flex items-center gap-3">
                  <div
                    className="w-2 h-8 rounded-full"
                    style={{
                      background: `linear-gradient(to bottom, ${secondaryAccentColor}, ${secondaryAccentDark})`,
                    }}
                  ></div>
                  {isStudentView ? "Classmates" : "Class Members"} (
                  {people.length})
                </h2>

                {people.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-r from-[var(--hover-bg)] to-[var(--card-bg)] rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <RiUser3Fill className="text-4xl text-[var(--muted-text)]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--muted-text)] mb-3">
                      {isStudentView ? "No classmates yet" : "No students yet"}
                    </h3>
                    <p className="text-[var(--muted-text)]">
                      {isStudentView
                        ? "You're the first student in this class!"
                        : "Students will appear here once they join your class"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {people.map((person) => (
                      <div
                        key={person._id}
                        className="group bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-color)] hover:border-[var(--secondary-accent-color)] transition-all duration-500 hover:shadow-xl"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="relative">
                            <div
                              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
                              style={{
                                background: `linear-gradient(to right, ${secondaryAccentColor}, ${secondaryAccentDark})`,
                              }}
                            >
                              {person.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-[var(--text-color)] text-lg">
                              {person.name}
                            </h3>
                            <p className="text-[var(--muted-text)] text-sm truncate">
                              {person.email}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(person.email);
                            toast.success("Email copied to clipboard! 📧");
                          }}
                          className="w-full bg-[var(--hover-bg)] text-[var(--text-color)] py-3 rounded-xl border border-[var(--border-color)] hover:border-[var(--secondary-accent-color)] transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                        >
                          <MdEmail style={{ color: secondaryAccentColor }} />
                          {isStudentView ? "Connect" : "Copy Email"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
