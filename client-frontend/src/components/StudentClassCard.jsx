import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical, FiUsers, FiBook } from "react-icons/fi";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";


import "../styles/StudentClassCard.css";

export default function ClassCard({ classData, onLeave }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

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

  const handleViewClass = () => {
    navigate(`/student/class/${classData._id}`, { state: { classData } });
  };

  const handleLeave = (id) => {
    if (window.confirm("Are you sure you want to leave this class?")) {
      try {
        onLeave(id);
        toast.success("You left the class successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        console.error("Error leaving class:", error);
        toast.error("Failed to leave class. Try again!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else {
      toast.info("Leave canceled", {
        position: "top-right",
        autoClose: 2000,
      });
    }
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="class-card-container">
      <div
        className="class-card-header"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h3 className="class-card-title">{classData.subject}</h3>
        <p className="class-card-subtitle">{classData.program}</p>

        <div className="class-card-menu" ref={menuRef}>
          <FiMoreVertical
            className="class-card-menu-icon"
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div className="class-card-dropdown">
              <div onClick={() => handleLeave(classData._id)}>Leave Class</div>
            </div>
          )}
        </div>
      </div>

      <div className="class-card-body">
        <div className="class-card-detail">
          <FiBook className="class-card-detail-icon" />
          <span>Room: {classData.room}</span>
        </div>
        <div className="class-card-detail">
          <FiUsers className="class-card-detail-icon" />
          <span>Teacher: {classData.teacher?.name || "Unknown"}</span>
        </div>
      </div>

      <hr className="class-card-line" />

      <button className="class-card-button" onClick={handleViewClass}>
        View Details
      </button>
    </div>
  );
}
