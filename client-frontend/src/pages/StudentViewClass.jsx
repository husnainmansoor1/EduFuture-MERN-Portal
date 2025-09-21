import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VscFileSymlinkDirectory } from "react-icons/vsc";
import { RiLinkM } from "react-icons/ri";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/StudentViewClass.css";
import { useBackgrounds } from "../context/BackgroundContext";

const StudentViewClass = () => {
  const { classID } = useParams();
  const [classData, setClassData] = useState({});
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;
  const { getBackground } = useBackgrounds();
  const background = getBackground(classData._id);

  // Fetch class info
  const fetchClassData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${API_BASE}/api/students/details/${classID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClassData(res.data);
    } catch (error) {
      toast.error("Failed to load class data", { autoClose: 4000 });
      console.error(
        "Error fetching class data:",
        error.response?.data || error.message
      );
    }
  };

  // Fetch class content
  const fetchClassContent = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/content/${classID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllContent(res.data);
    } catch (error) {
      toast.error("Failed to load class content", { autoClose: 4000 });
      console.error(
        "Error fetching content:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassData();
    fetchClassContent();
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
      <div className="view-class-container-std">
        <Navbar onSidebarToggle={toggleSidebar} />
        <div className="loading-container-std">
          <p>Loading class content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-class-container-std">
      <Navbar onSidebarToggle={toggleSidebar} />
      <div className="view-main-container-std">
        <div className="view-class-main-std">
          <div className="student-sidebar-component">
            <Sidebar isOpen={isSidebarOpen} />
          </div>

          <div className="view-class-content-std">
            {classData && Object.keys(classData).length > 0 ? (
              <div className="class-info-std">
                <div
                  className="class-info-box1-std"
                  style={{
                    backgroundImage: `url(${background})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                    backgroundColor: "#423b3b",
                  }}
                >
                  <h3 className="subject-title-std">{classData?.subject}</h3>
                  <p className="program-title-std">{classData?.program}</p>
                </div>
              </div>
            ) : (
              <p>Loading class info...</p>
            )}
            <div className="posted-content-text-std">
              <h3>Class Materials & Announcements</h3>
            </div>
            {/* Class Materials & Announcements */}
            <div className="posted-content-section-std">
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="36"
                            height="36"
                            viewBox="0 0 24 24"
                            className="author-avatar-std"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="12"
                              fill="white"
                              stroke="#2c88d9"
                              strokeWidth="2"
                            />
                            <path
                              d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8V22h19.2v-2.8c0-3.2-6.4-4.8-9.6-4.8z"
                              fill="#2c88d9"
                            />
                          </svg>
                          <span className="teacher-name-std">
                            {item.teacherID?.name || "Teacher"}
                          </span>
                        </div>
                      </div>

                      {item.text && (
                        <p className="content-text-std">{item.text}</p>
                      )}

                      <div className="content-attachments-std">
                        {item.fileUrl && (
                          <a
                            href={`${API_BASE}/${item.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="file-link-std"
                            title={item.fileUrl.split("/").pop()}
                          >
                            <VscFileSymlinkDirectory size={20} />
                            Attachment
                          </a>
                        )}
                        {item.linkUrl && (
                          <a
                            href={item.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="video-link-std"
                            title={item.linkUrl}
                          >
                            <RiLinkM size={20} />
                            Resource Link
                          </a>
                        )}
                      </div>

                      <div className="content-footer-std">
                        <small className="post-date-std">
                          {formatDate(item.createdAt)}
                        </small>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentViewClass;
