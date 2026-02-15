import axios from "axios";
import { useEffect, useState, lazy, Suspense, memo } from "react";
import { toast } from "react-toastify";
import {
  FaRocket,
  FaGraduationCap,
  FaPlus,
  FaUsers,
  FaBookOpen,
  FaChartLine,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  IoSparkles,
  IoPeople,
  IoBook,
  IoTime,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { MdWorkspacePremium, MdClass } from "react-icons/md";

import "../styles/StudentDashboard.css";

// Lazy-load components
const StudentClassCard = lazy(() => import("../components/StudentClassCard"));
const JoinClassModal = lazy(() => import("../components/JoinClassModal"));

// Memoize components
import NavbarComponent from "../components/Navbar";
import SidebarComponent from "../components/Sidebar";
const Navbar = memo(NavbarComponent);
const Sidebar = memo(SidebarComponent);

import ClassCardSkeleton from "../components/ClassCardSkeleton";

export default function StudentDashboard() {
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClasses: 0,
    activeAssignments: 0,
    completionRate: 0,
    upcomingDeadlines: 0,
  });

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL;

  const fetchEnrolledClasses = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/students/enrolled`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ensure it's always an array and remove null/undefined values
      const validClasses = Array.isArray(res.data)
        ? res.data.filter((cls) => cls && cls._id)
        : [];

      setEnrolledClasses(validClasses);

      // Calculate stats
      const totalClasses = validClasses.length;
      const activeAssignments = validClasses.reduce(
        (acc, cls) => acc + (cls.assignmentsCount || 0),
        0
      );
      const completionRate =
        totalClasses > 0
          ? Math.round(
              (validClasses.filter((cls) => cls.progress > 50).length /
                totalClasses) *
                100
            )
          : 0;
      const upcomingDeadlines = validClasses.reduce(
        (acc, cls) => acc + (cls.upcomingDeadlines || 0),
        0
      );

      setStats({
        totalClasses,
        activeAssignments,
        completionRate,
        upcomingDeadlines,
      });
    } catch (error) {
      toast.error("Failed to fetch enrolled classes", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledClasses();
  }, []);

  const handleJoinClass = async (classCode) => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/students/join`,
        { classCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Class joined successfully!", { autoClose: 2000 });



      setShowJoinModal(false);
      fetchEnrolledClasses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join class", {
        autoClose: 2000,
      });
    }
  };

  const handleLeaveClass = async (classId) => {
    if (window.confirm("Are you sure you want to leave this class?")) {
      try {
        await axios.delete(`${API_BASE}/api/students/leave/${classId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Class left successfully!", { autoClose: 2000 });
        fetchEnrolledClasses();
      } catch (error) {
        toast.error("Failed to leave class", { autoClose: 2000 });
      }
    }
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-6 border-4 border-cyan-500 border-b-transparent rounded-full animate-spin-slow"></div>
          </div>
          <p className="text-white text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            Loading Your Learning Space...
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

      <Navbar
        onSidebarToggle={toggleSidebar}
        onCreateClick={() => setShowJoinModal(true)}
      />

      <div className="flex pt-16 relative z-10">
        <Sidebar
          isOpen={isSidebarOpen}
          onCreateClick={() => setShowJoinModal(true)}
          enrollData={enrolledClasses}
          classData={enrolledClasses}
        />

        <div className="main-section flex-1 ml-0 lg:ml-64 transition-all duration-500">
          {/* Hero Section */}
          <div className="hero-section relative bg-gradient-to-br bg-[var(--hero-bg)] overflow-hidden">
            <div className="max-w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  {/* Animated Badge */}
                  <div className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-full mb-6 animate-pulse-slow shadow-lg">
                    <IoSparkles className="mr-2 animate-spin-slow" />
                    <span className="font-bold tracking-wider">
                      STUDENT PRO
                    </span>
                  </div>

                  <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                      Learning
                    </span>
                    <span className="block bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent animate-gradient animation-delay-1000">
                      Dashboard
                    </span>
                  </h1>

                  <p className="text-xl text-[var(--muted-text)] mb-8 max-w-2xl leading-relaxed">
                    Explore interactive classes, track your progress, and
                    achieve academic excellence with personalized learning
                    tools.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => setShowJoinModal(true)}
                      className="group relative bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/30 flex items-center gap-3 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        <MdClass className="group-hover:animate-bounce" />
                        Join New Class
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="content-area max-w-full px-4 sm:px-6 lg:px-8 py-8">
            {/* Classes Section */}
            <div className="mb-12">
             

              {enrolledClasses.length === 0 ? (
                <div className="bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-lg rounded-3xl p-16 border-2 border-dashed border-[var(--border-color)] text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float">
                      <MdWorkspacePremium className="text-white text-5xl" />
                    </div>
                    <h3 className="text-3xl font-bold text-[var(--text-color)] mb-4">
                      Start Your Learning Journey
                    </h3>
                    <p className="text-[var(--muted-text)] text-lg mb-8 max-w-md mx-auto">
                      Join your first class and unlock amazing learning
                      experiences
                    </p>
                    <button
                      onClick={() => setShowJoinModal(true)}
                      className="group bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 flex items-center gap-3 mx-auto animate-pulse-slow"
                    >
                      <FaGraduationCap className="group-hover:animate-bounce" />
                      <span>Join First Class</span>
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
                    {enrolledClasses.map((cls, index) => (
                      <StudentClassCard
                        key={cls._id || index}
                        classData={cls}
                        onLeave={handleLeaveClass}
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
      {showJoinModal && (
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
          <JoinClassModal
            onClose={() => setShowJoinModal(false)}
            onSubmit={handleJoinClass}
          />
        </Suspense>
      )}

      {/* Floating Join Button */}
      <div className="fixed bottom-8 right-8 z-20">
        <button
          onClick={() => setShowJoinModal(true)}
          className="group w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-cyan-500/30 hover:scale-110 transition-all duration-300 animate-bounce-slow"
        >
          <FaPlus className="text-2xl group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}
