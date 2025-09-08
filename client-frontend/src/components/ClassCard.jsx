import { FiMoreVertical, FiBook } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ClassCard.css";
import { ConfirmDialog } from "./ConfirmDialog";


export default function ClassCard({
  classData,
  showMenu,
  onToggleMenu,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const bgImages = [
    "https://www.gstatic.com/classroom/themes/img_code.jpg",
    "https://www.gstatic.com/classroom/themes/img_mealfamily.jpg",
    "https://www.gstatic.com/classroom/themes/img_breakfast.jpg",
    "https://www.gstatic.com/classroom/themes/img_graduation.jpg",
    "https://www.gstatic.com/classroom/themes/img_backtoschool.jpg",
  ];

  const getImageIndex = (id) =>
    id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    bgImages.length;

  const backgroundImage = bgImages[getImageIndex(classData._id)];

  const handleViewClass = (e) => {
    e.stopPropagation();
    navigate(`/view-class/${classData._id}`, { state: { classData } });
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    onToggleMenu();
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    try {
      onDelete(deleteId);
      toast.success("Class deleted successfully!", { autoClose: 3000 });
    } catch (error) {
      toast.error("Failed to delete class. Please try again.", { autoClose: 3000 });
    } finally {
      setShowConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    toast.info("Delete canceled", { autoClose: 2000 });
  };

  const handleEdit = (classData) => {
    try {
      onEdit(classData);
      toast.success("Edit mode opened!", { autoClose: 2000 });
    } catch (error) {
      toast.error("Failed to open edit mode.", { autoClose: 2000 });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (showMenu) onToggleMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu, onToggleMenu]);

  return (
    <div className="class-card">
      <div
        className="card-wrap"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h3 className="card-title">
          {classData.subject}
          <p className="card-program">{classData.program}</p>
        </h3>
      </div>

      <div className="card-info">
        <div className="card-detail">
          <FiBook className="detail-icon" />
          <span>Room: {classData.room}</span>
        </div>
      </div>

      <hr className="card-line" />

      <div className="card-bottom">
        <button className="card-button" onClick={handleViewClass}>
          View Class
        </button>

        <div className="menu-wrapper" ref={menuRef}>
          <FiMoreVertical onClick={handleMenuClick} className="menu-icon" />
          {showMenu && (
            <div className="dropdown-menu">
              <div onClick={() => handleEdit(classData)}>Edit</div>
              <div onClick={() => handleDeleteClick(classData._id)}>Delete</div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        show={showConfirm}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

    </div>
  );
}
