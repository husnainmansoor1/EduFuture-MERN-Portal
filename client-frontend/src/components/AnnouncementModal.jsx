import { useState, useEffect } from "react";
import "../styles/AnnouncementModal.css";
import { MdDriveFileMoveRtl } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AnnouncementModal({ onClose, onSubmit, classID, editData = null }) {
  const [text, setText] = useState(editData ? editData.text : "");
  const [file, setFile] = useState(null); 
  const [linkUrl, setLinkUrl] = useState(editData ? editData.linkUrl : "");

  useEffect(() => {
    if (editData) {
      setText(editData.text || "");
      setLinkUrl(editData.linkUrl || "");
      setFile(null); 
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
      if (!editData) formData.append("classID", classID); 
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
        <button 
          className="absolute top-3 right-3.5 bg-transparent border-none text-xl font-bold text-[var(--secondary-text)] cursor-pointer transition-colors duration-200 hover:text-[#e74c3c]" 
          onClick={onClose}
        >
          ✕
        </button>

        <div className="p-0">
          <h2 className="text-xl font-semibold mb-4 text-center text-[var(--text-color)]">
            {editData ? "Edit Announcement" : "Post Announcement"}
          </h2>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Announce something to your class"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-[100%] h-20 p-3 text-sm border border-[var(--modal-border)] rounded-lg resize-none mb-4 bg-[var(--input-bg-2)] transition-colors duration-200 focus:border-[var(--primary-color)] focus:outline-none hover:border-[var(--primary-hover)] hover:text-[var(--muted-text)]"
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
              className="block w-[100%] mb-4 p-3 border border-[var(--modal-border)] rounded-lg text-[var(--text-color)] bg-[var(--input-bg-2)] transition-colors duration-200 focus:border-[var(--primary-color)] focus:outline-none hover:border-[var(--primary-hover)] hover:text-[var(--muted-text)]"
            />

            <button 
              type="submit" 
              className="w-full bg-[var(--primary-color)] text-white font-semibold py-3 px-4 border-none rounded-lg cursor-pointer transition-colors duration-250 hover:bg-[var(--primary-hover)]"
            >
              {editData ? "Update" : "Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}