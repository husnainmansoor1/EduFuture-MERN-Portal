import { useEffect, useState, lazy, Suspense, memo } from "react";
import axios from "axios";
import {
  FaPlus,
  FaRocket,
  FaChartLine,
  FaUsers,
  FaCog,
  FaBell,
  FaCalendarAlt,
  FaFileAlt,
  FaLightbulb,
  FaGraduationCap,
  FaCloudUploadAlt,
} from "react-icons/fa";
import {
  IoSparkles,
  IoSettings,
  IoStatsChart,
  IoPeople,
  IoBook,
  IoTime,
  IoCheckmarkCircle,
} from "react-icons/io5";
import {
  MdDashboard,
  MdSchool,
  MdClass,
  MdTrendingUp,
  MdInsertChart,
  MdWorkspacePremium,
} from "react-icons/md";
import { GiTeacher, GiBrain, GiStarFormation } from "react-icons/gi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/TeacherDashboard.css";

// Lazy-load heavy components
const ClassCard = lazy(() => import("../components/ClassCard"));
const CreateClassModal = lazy(() => import("../components/CreateClassModal"));

// Memoize Navbar and Sidebar
import NavbarComponent from "../components/Navbar";
import SidebarComponent from "../components/Sidebar";
const Navbar = memo(NavbarComponent);
const Sidebar = memo(SidebarComponent);

import ClassCardSkeleton from "../components/ClassCardSkeleton";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editClassData, setEditClassData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalResources: 0,
    engagementRate: 0,
    activeClasses: 0,
  });

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL;

  // Fetch Classes Function
  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/classes/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data);

      // Calculate stats
      const totalStudents = res.data.reduce(
        (acc, cls) => acc + (cls.studentsCount || 0),
        0,
      );
      const totalResources = res.data.reduce(
        (acc, cls) => acc + (cls.resourcesCount || 0),
        0,
      );
      const activeClasses = res.data.filter((cls) => cls.isActive).length;
      const engagementRate =
        res.data.length > 0
          ? Math.round(
              (res.data.filter((cls) => cls.studentsCount > 0).length /
                res.data.length) *
                100,
            )
          : 0;

      setStats({
        totalStudents,
        totalResources,
        engagementRate,
        activeClasses,
      });
    } catch (err) {
      toast.error("Failed to fetch classes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [token]);

  const handleToggleMenu = (id) =>
    setActiveMenuId(activeMenuId === id ? null : id);

  const handleCloseMenu = () => setActiveMenuId(null);

  const openCreateModal = () => {
    setIsEditMode(false);
    setEditClassData(null);
    setShowModal(true);
  };

  const openEditModal = (classData) => {
    setEditClassData(classData);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleCreate = async (data) => {
    try {
      await axios.post(`${API_BASE}/api/classes/create`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await axios.put(`${API_BASE}/api/classes/${editClassData._id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      setIsEditMode(false);
      setEditClassData(null);
      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/classes/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-6 border-4 border-cyan-500 border-b-transparent rounded-full animate-spin-slow"></div>
          </div>
          <p className="text-white text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            Preparing Your Teaching Space...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--bg-color)]">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-300 dark:bg-cyan-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar onCreateClick={openCreateModal} onSidebarToggle={toggleSidebar} />

      <div className="flex pt-16 relative z-10">
        <Sidebar
          onCreateClick={openCreateModal}
          isOpen={isSidebarOpen}
          subjects={classes}
          classData={classes}
        />

        <div className="main-section flex-1 ml-0 lg:ml-64 transition-all duration-500">
          {/* Hero Section with Floating Elements */}
          <div className="hero-section relative bg-gradient-to-br bg-[var(--hero-bg)] overflow-hidden">
            <div className="max-w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  {/* Animated Badge */}
                  <div className="inline-flex items-center bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-full mb-6 animate-pulse-slow shadow-lg">
                    <IoSparkles className="mr-2 animate-spin-slow" />
                    <span className="font-bold tracking-wider">
                      EDUCATOR PRO
                    </span>
                  </div>

                  <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                      Teaching
                    </span>
                    <span className="block bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient animation-delay-1000">
                      Dashboard
                    </span>
                  </h1>

                  <p className="text-xl text-[var(--muted-text)] mb-8 max-w-2xl leading-relaxed">
                    Transform your teaching experience with powerful analytics,
                    interactive classrooms, and seamless student management
                    tools.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="content-area max-w-full px-4 sm:px-6 lg:px-8 py-8">
            {/* Classes Section with Premium Design */}
            <div className="mb-12">
              {classes.length === 0 ? (
                <div className="bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-lg rounded-3xl p-16 border-2 border-dashed border-[var(--border-color)] text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5"></div>
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float">
                      <MdWorkspacePremium className="text-white text-5xl" />
                    </div>
                    <h3 className="text-3xl font-bold text-[var(--text-color)] mb-4">
                      Ready to Inspire?
                    </h3>
                    <p className="text-[var(--muted-text)] text-lg mb-8 max-w-md mx-auto">
                      Create your first class and start transforming students'
                      learning experiences
                    </p>
                    <button
                      onClick={openCreateModal}
                      className="group bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 flex items-center gap-3 mx-auto animate-pulse-slow"
                    >
                      <FaGraduationCap className="group-hover:animate-bounce" />
                      <span>Create First Class</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Suspense
                  fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-full">
                          <ClassCardSkeleton />
                        </div>
                      ))}
                    </div>
                  }
                >
                  <div className="class-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                      <ClassCard
                        key={cls._id}
                        classData={cls}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                        showMenu={activeMenuId === cls._id}
                        onToggleMenu={() => handleToggleMenu(cls._id)}
                      />
                    ))}
                  </div>
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="relative">
                <div className="w-32 h-32 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-10 border-4 border-purple-400 border-b-transparent rounded-full animate-spin-slow"></div>
              </div>
            </div>
          }
        >
          <CreateClassModal
            onClose={() => setShowModal(false)}
            onSubmit={isEditMode ? handleUpdate : handleCreate}
            initialData={editClassData}
            isEdit={isEditMode}
          />
        </Suspense>
      )}

      {/* Floating Elements */}
      <div className="fixed bottom-8 right-8 z-20">
        <button
          onClick={openCreateModal}
          className="group w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-cyan-500/30 hover:scale-110 transition-all duration-300 animate-bounce-slow"
        >
          <FaPlus className="text-2xl group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}
