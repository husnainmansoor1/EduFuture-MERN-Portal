import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VscFileSymlinkDirectory } from "react-icons/vsc";
import { RiLinkM } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AnnouncementModal from "../components/AnnouncementModal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import "../styles/ViewClass.css";
import { useBackgrounds } from "../context/BackgroundContext";

const ViewClass = () => {
  const { classID } = useParams();
  const [classData, setClassData] = useState({});
  const [allContent, setAllContent] = useState([]);
  const [showModal, setShowModal] = useState({ open: false, editData: null });
  const [menuOpen, setMenuOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [activeTab, setActiveTab] = useState("stream");
  const [students, setStudents] = useState([]);

  const { getBackground } = useBackgrounds();
  const background = getBackground(classData._id);

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  // Fetch class info
  const fetchClassData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_BASE}/api/subject/${classID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassData(res.data);
    } catch (error) {
      console.error("Error fetching class data:", error.message);
    }
  };

  // Fetch students list
  const fetchClassStudents = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${API_BASE}/api/students/students/${classID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents(Array.isArray(res.data) ? res.data : res.data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error.message);
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
    } finally {
      setLoading(false);
    }
  };

  // Create or update announcement
  const handleAnnouncementSubmit = async (
    idOrFormData,
    isEdit = false,
    formData = null
  ) => {
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

  // Delete content
  const handleDelete = async (id) => {
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
    fetchClassStudents();
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
      <div className="view-class-container">
        <Navbar onSidebarToggle={() => setIsSidebarOpen((p) => !p)} />
        <div className="loading-container">
          <p>Loading class content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-class-container">
      <Navbar
        onCreateClick={() => setShowModal({ open: true, editData: null })}
        onSidebarToggle={toggleSidebar}
      />
      <div className="view-main-container">
        <div className="view-class-main">
          <Sidebar
            isOpen={isSidebarOpen}
            onCreateClick={() => setShowModal({ open: true, editData: null })}
          />
          <div className="stream-container">
            {/* Tabs */}
            <div className="tabs-container">
              <button
                className={activeTab === "stream" ? "tab active" : "tab"}
                onClick={() => setActiveTab("stream")}
              >
                Stream
              </button>
              <button
                className={activeTab === "people" ? "tab active" : "tab"}
                onClick={() => setActiveTab("people")}
              >
                People
              </button>
            </div>

            {/* Stream Tab */}
            {activeTab === "stream" && (
              <div className="view-class-content">
                {classData && Object.keys(classData).length > 0 ? (
                  <div className="class-info">
                    <div
                      className="class-info-box1"
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
                      <h3 className="subject-title">{classData?.subject}</h3>
                      <p className="program-title">{classData?.program}</p>
                    </div>
                  </div>
                ) : (
                  <p>Loading class info...</p>
                )}

                {/* Class Code & Posted Content */}
                <div className="view-modal">
                  <div className="class-info-box2">
                    <div className="code-title">
                      <p className="code-text-one">Class Code</p>
                      <p
                        className="code-text-two copy-code"
                        onClick={() => {
                          navigator.clipboard.writeText(classData?.code);
                          toast.success("Class code copied ");
                        }}
                      >
                        {classData?.code}
                      </p>
                    </div>
                  </div>
                  <div className="Posted-content-text">
                    <h3>Posted Content</h3>
                  </div>
                </div>

                {/* Announcement Modal */}
                {showModal.open && (
                  <AnnouncementModal
                    onClose={() =>
                      setShowModal({ open: false, editData: null })
                    }
                    onSubmit={handleAnnouncementSubmit}
                    classID={classID}
                    editData={showModal.editData}
                  />
                )}

                {/* Posted Content Section */}
                <div className="posted-content-section">
                  {allContent.length === 0 ? (
                    <p>No content posted yet.</p>
                  ) : (
                    allContent
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((item) => (
                        <div className="posted-item" key={item._id}>
                          <div className="content-header">
                            <div className="author-info">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="36"
                                height="36"
                                viewBox="0 0 24 24"
                                className="author-avatar"
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
                              <span className="teacher-name">
                                {item.teacherID?.name || "Unknown"}
                              </span>
                            </div>

                            <div className="menu-wrapper">
                              <button
                                className="menu-btn"
                                onClick={() =>
                                  setMenuOpen(
                                    menuOpen === item._id ? null : item._id
                                  )
                                }
                              >
                                ⋮
                              </button>
                              {menuOpen === item._id && (
                                <div className="dropdown-menu">
                                  <button
                                    onClick={() =>
                                      setShowModal({
                                        open: true,
                                        editData: item,
                                      })
                                    }
                                  >
                                    <FaRegEdit
                                      size={10}
                                      style={{ marginRight: 5 }}
                                    />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeleteId(item._id);
                                      setShowConfirm(true);
                                      setMenuOpen(null);
                                    }}
                                  >
                                    <MdDelete
                                      size={10}
                                      style={{ marginRight: 5 }}
                                    />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="content-body">
                            {item.text && (
                              <p className="post-text">{item.text}</p>
                            )}
                            <div className="attachments">
                              {item.fileUrl && (
                                <a
                                  href={`${API_BASE}/${item.fileUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="file-link"
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
                                  className="video-link"
                                  title={item.linkUrl}
                                >
                                  <RiLinkM size={20} />
                                  Resource Link
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="content-footer">
                            <small className="post-date">
                              {formatDate(item.createdAt)}
                            </small>
                          </div>
                        </div>
                      ))
                  )}
                </div>

                <ConfirmDialog
                  show={showConfirm}
                  onConfirm={() => handleDelete(deleteId)}
                  onCancel={() => setShowConfirm(false)}
                />
              </div>
            )}

            {/* People Tab */}

            {activeTab === "people" && (
              <div className="people-tab">
                <h3>Students</h3>
                <div className="line"></div>
                {students.length === 0 ? (
                  <p>No students joined yet.</p>
                ) : (
                  <ul className="student-list">
                    {students.map((s) => (
                      <li key={s._id} className="student-item">
                        {/* Alphabet Avatar */}
                        <div className="student-avatar">
                          {s.name ? s.name.charAt(0).toUpperCase() : "?"}
                        </div>

                        {/* Student Name */}
                        <span className="student-name">{s.name}</span>

                        {/* Email Icon */}
                        <MdEmail
                          className="email-icon"
                          title={s.email}
                          onClick={() => {
                            navigator.clipboard.writeText(s.email);
                            alert("Email copied to clipboard!");
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewClass;
