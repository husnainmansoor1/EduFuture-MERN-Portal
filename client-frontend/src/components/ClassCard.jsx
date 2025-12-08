import { FiMoreVertical, FiBook } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConfirmDialog } from "./ConfirmDialog";
import { useBackgrounds } from "../context/BackgroundContext";
import "../styles/ClassCard.css"; // media queries here

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
  const { getBackground } = useBackgrounds();
  const background = getBackground(classData._id);

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
      toast.success("Class deleted successfully!");
    } catch {
      toast.error("Failed to delete class.");
    } finally {
      setShowConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    toast.info("Delete canceled");
  };

  const handleEdit = () => {
    try {
      onEdit(classData);
      toast.success("Edit mode opened!");
    } catch {
      toast.error("Failed to open edit mode.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (showMenu) onToggleMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu, onToggleMenu]);

  return (
    <div className="class-card bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg w-full my-2 flex flex-col shadow-md transition-all duration-300">
      {/* Banner */}
      <div
        className="w-full h-[140px] rounded-t-lg bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <h3 className="text-white p-4 text-left font-bold text-[1.2rem] font-sans">
          {classData.subject}
          <p className="text-[#f1f1f1] mt-1 text-[14px] font-sans">
            {classData.program}
          </p>
        </h3>
      </div>

      {/* Details */}
      <div className="flex items-center gap-2 text-[var(--text-color)] text-[15px] m-4">
        <FiBook className="text-[1.1rem]" />
        <span>Room: {classData.room}</span>
      </div>

      <hr className="my-0 border-t border-[var(--card-border)]" />

      {/* Bottom */}
      <div className="flex justify-between items-center p-4 w-full box-border">
        <button
          className="bg-[#2cabe6] text-white py-2 px-7 rounded-md cursor-pointer text-[14px] hover:bg-[#11b4ff] transition"
          onClick={handleViewClass}
        >
          View Class
        </button>

        {/* Menu */}
        <div className="text-2xl cursor-pointer text-[var(--text-color)] relative" ref={menuRef}>
          <FiMoreVertical onClick={handleMenuClick} />

          {showMenu && (
            <div className="absolute top-[-74px] right-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md shadow-lg min-w-[120px] z-[100]">
              <div
                className="px-3 py-2 text-[14px] cursor-pointer border-b border-[var(--card-border)] hover:bg-black/10"
                onClick={handleEdit}
              >
                Edit
              </div>

              <div
                className="px-3 py-2 text-[14px] cursor-pointer hover:bg-black/10"
                onClick={() => handleDeleteClick(classData._id)}
              >
                Delete
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        show={showConfirm}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
