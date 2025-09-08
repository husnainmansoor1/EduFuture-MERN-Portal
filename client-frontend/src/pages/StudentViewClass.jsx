import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import { FiPaperclip, FiExternalLink } from "react-icons/fi"; 
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/StudentViewClass.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentViewClass = () => {
  const { classID } = useParams();
  const [classData, setClassData] = useState({});
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  const bgImages = [
    "https://www.gstatic.com/classroom/themes/img_code.jpg",
    "https://www.gstatic.com/classroom/themes/img_mealfamily.jpg",
    "https://www.gstatic.com/classroom/themes/img_breakfast.jpg",
    "https://www.gstatic.com/classroom/themes/img_graduation.jpg",
    "https://www.gstatic.com/classroom/themes/img_backtoschool.jpg",
  ];

  const getImageIndex = (id) => {
    if (!id) return 0;
    let sum = 0;
    for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
    return sum % bgImages.length;
  };

  const backgroundImage = getImageIndex(classData?._id);

  const fetchClassData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${API_BASE}/api/students/details/${classID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClassData(res.data);
    } catch (error) {
      toast.error("Failed to load class data", { autoClose: 4000 });
      console.error("Error fetching class data:", error.response?.data || error.message);
    }
  };

  const fetchClassContent = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_BASE}/api/content/${classID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllContent(res.data);
    } catch (error) {
      toast.error("Failed to load class content", { autoClose: 4000 });
      console.error("Error fetching content:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassData();
    fetchClassContent();
  }, [classID]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!", { autoClose: 2500 });
    navigate("/login");
  };

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
      <div className="view-class-container-std">
        <Navbar onLogout={handleLogout} onSidebarToggle={toggleSidebar} />
        <div className="loading-container-std">
          <p>Loading class content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-class-container-std">
      <Navbar onLogout={handleLogout} onSidebarToggle={toggleSidebar} />
      <div className="view-class-main-std">
        <Sidebar isOpen={isSidebarOpen} onLogout={handleLogout} />
        <div className="view-class-content-std">
          {classData && Object.keys(classData).length > 0 ? (
            <div className="class-info-std">
              <div
                className="class-info-box1-std"
                style={{
                  backgroundImage: `url(${bgImages[backgroundImage]})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <h3 className="subject-title-std">{classData?.subject}</h3>
                <p className="program-title-std">{classData?.program}</p>
              </div>
            </div>
          ) : (
            <p>Loading class info...</p>
          )}

          <div className="posted-content-section-std">
            <h3>Class Materials & Announcements</h3>
            {allContent.length === 0 ? (
              <div className="no-content-std">
                <p>No content posted yet. Check back later for updates!</p>
              </div>
            ) : (
              allContent
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((item) => (
                  <div className="posted-item-std" key={item._id}>
                    <div className="content-header-std">
                      <div className="author-info-std">
                        <VscAccount size={36} className="author-avatar-std" />
                        <span className="teacher-name-std">{item.teacherID?.name || "Teacher"}</span>
                      </div>
                    </div>

                    {item.text && <p className="content-text-std">{item.text}</p>}

                    <div className="content-attachments-std">
                      {item.fileUrl && (
                        <a
                          href={`${API_BASE}/${item.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="file-link-std"
                        >
                          <FiPaperclip size={16} style={{ marginRight: "6px" }} />
                          View Attachment
                        </a>
                      )}
                      {item.linkUrl && (
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="video-link-std"
                        >
                          <FiExternalLink size={16} style={{ marginRight: "6px" }} />
                          Open Link
                        </a>
                      )}
                    </div>

                    {/* Footer Date */}
                    <div className="content-footer-std">
                      <small className="post-date-std">{formatDate(item.createdAt)}</small>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentViewClass;
