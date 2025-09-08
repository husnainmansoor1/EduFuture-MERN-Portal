import { useState, useEffect } from "react";
import "../styles/AnnouncementModal.css";
import { MdDriveFileMoveRtl } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AnnouncementModal({ onClose, onSubmit, classID, editData = null }) {
  // If editing, prefill values
  const [text, setText] = useState(editData ? editData.text : "");
  const [file, setFile] = useState(null); // for new upload
  const [linkUrl, setLinkUrl] = useState(editData ? editData.linkUrl : "");

  useEffect(() => {
    if (editData) {
      setText(editData.text || "");
      setLinkUrl(editData.linkUrl || "");
      setFile(null); // optional: you can keep previous file if needed
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text && !file && !linkUrl) {
      toast.error("Please write some content or attach a file/link.", { autoClose: 2500 });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", text);
      if (!editData) formData.append("classID", classID); // only for new announcements
      if (file) formData.append("attachment", file);
      if (linkUrl) formData.append("linkUrl", linkUrl);

      // ternary: edit or create
      await onSubmit(editData ? editData._id : formData, editData ? true : false, formData);

      toast.success(editData ? "Announcement updated successfully!" : "Announcement posted successfully!", { autoClose: 2500 });

      // reset
      setText("");
      setFile(null);
      setLinkUrl("");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to post announcement. Try again!", { autoClose: 2500 });
    }
  };

  return (
    <div className="annouce-modal-overlay">
      <div className="annouce-modal-box">
        <button className="annouce-modal-close-icon" onClick={onClose}>
          ✕
        </button>

        <div className="annouce-modal-box-container">
          <h2>{editData ? "Edit Announcement" : "Post Announcement"}</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Announce something to your class"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="annouce-modal-textarea"
            />

            <label className="annouce-custom-file-upload">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <MdDriveFileMoveRtl /> Choose File
              <span className="annouce-file-chosen">
                {file ? file.name : editData?.fileUrl ? editData.fileUrl.split("/").pop() : "No file chosen"}
              </span>
            </label>

            <input
              type="text"
              placeholder="Paste video or URL (optional)"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="annouce-modal-input"
            />

            <button type="submit" className="annouce-modal-button">
              {editData ? "Update" : "Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
