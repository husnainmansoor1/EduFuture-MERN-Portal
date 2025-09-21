import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import JoinClassModal from "../components/JoinClassModal";
import StudentClassCard from "../components/StudentClassCard";

import "../styles/StudentDashboard.css";

export default function StudentDashboard() {
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchEnrolledClasses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/students/enrolled",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Ensure it's always an array and remove null/undefined values
      const validClasses = Array.isArray(res.data)
        ? res.data.filter((cls) => cls && cls._id)
        : [];

      setEnrolledClasses(validClasses);
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
      await axios.post("http://localhost:5000/api/students/join", classCode, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowJoinModal(false);
      fetchEnrolledClasses();
    } catch (error) {
      console.error("Error leaving class:", error);
    }
  };

  const handleLeaveClass = async (classId) => {
    if (window.confirm("Are you sure you want to leave this class?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/students/leave/${classId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
      <div className="dashboard-container">
        <Navbar onSidebarToggle={toggleSidebar} />
        <div className="loading-container">
          <p>Loading your classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar
        onSidebarToggle={toggleSidebar}
        onCreateClick={() => setShowJoinModal(true)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onCreateClick={() => setShowJoinModal(true)}
        enrollData={enrolledClasses}
      />

      <main className="student-content">
        {enrolledClasses.length === 0 ? (
          <div className="no-classes">
            <h3>No Classes Joined Yet</h3>
            <p>Use a class code to join your first class</p>
            <button
              className="join-first-class-btn"
              onClick={() => setShowJoinModal(true)}
            >
              Join Your First Class
            </button>
          </div>
        ) : (
          enrolledClasses.map((cls, index) => (
            <StudentClassCard
              key={cls._id || index} // fallback key
              classData={cls}
              onLeave={handleLeaveClass}
            />
          ))
        )}
      </main>

      {showJoinModal && (
        <JoinClassModal
          onClose={() => setShowJoinModal(false)}
          onSubmit={handleJoinClass}
        />
      )}
    </div>
  );
}
