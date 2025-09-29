import axios from "axios";
import { useEffect, useState } from "react";
import ClassCard from "../components/ClassCard";
import CreateClassModal from "../components/CreateClassModal";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/TeacherDashboard.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editClassData, setEditClassData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/classes/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data);
    } catch (err) {
      toast.error(" Failed to fetch classes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleCloseMenu = () => {
    setActiveMenuId(null);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreate = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/classes/create", data, {
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
      await axios.put(
        `http://localhost:5000/api/classes/${editClassData._id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      await axios.delete(`http://localhost:5000/api/classes/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

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

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  if (loading) {
    return (
      <div className="teacher-dashboard">
        <Navbar onSidebarToggle={() => setIsSidebarOpen((p) => !p)} />
        <div className="loading-container">
          <p>Loading class content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard">
      <Navbar onCreateClick={openCreateModal} onSidebarToggle={toggleSidebar} />
      <div className="teacher-container">
        <div className="sidebar-container">
      <Sidebar
        onCreateClick={openCreateModal}
        isOpen={isSidebarOpen}
        subjects={classes}
        classData={classes}
      />
      </div>
      
      
      <div className="teacher-content" onClick={handleCloseMenu}>
        {classes.length === 0 ? (
          <div className="no-classes">
            <h3>No Classes Created Yet</h3>
            <p>Use the + button to create your first class</p>
            <button
              className="create-first-class-btn"
              onClick={openCreateModal}
            >
              Create Your First Class
            </button>
          </div>
        ) : (
          classes.map((cls) => (
            <ClassCard
              key={cls._id}
              classData={cls}
              onEdit={openEditModal}
              onDelete={handleDelete}
              showMenu={activeMenuId === cls._id}
              onToggleMenu={() => handleToggleMenu(cls._id)}
            />
          ))
        )}
      </div>
      {showModal && (
        <CreateClassModal
          onClose={() => setShowModal(false)}
          onSubmit={isEditMode ? handleUpdate : handleCreate}
          initialData={editClassData}
          isEdit={isEditMode}
        />
      )}
      </div>
    </div>
  );
}
