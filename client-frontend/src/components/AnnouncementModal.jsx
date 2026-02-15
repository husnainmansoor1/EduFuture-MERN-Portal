import { useState, useEffect } from "react";
import "../styles/AnnouncementModal.css";
import { MdDriveFileMoveRtl, MdAnnouncement } from "react-icons/md";
import { FaLink, FaPaperPlane } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
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
        {/* Decorative gradient orbs */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <button 
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-full text-xl font-bold text-gray-400 hover:text-red-400 cursor-pointer transition-all duration-300 hover:rotate-90 hover:scale-110 z-10 backdrop-blur-sm" 
          onClick={onClose}
        >
          ✕
        </button>

        {/* Header with gradient and icon */}
        <div className="relative mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-purple-600 via-indigo-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 transform hover:scale-110 transition-transform duration-500">
                <MdAnnouncement className="text-white text-2xl drop-shadow-lg" />
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2 tracking-tight">
              {editData ? "Edit Announcement" : "Make Announcement"}
            </h2>
            <p className="text-gray-400 text-sm font-light flex items-center justify-center gap-2">
              <IoSparkles className="text-purple-400" />
              {editData ? "Update your message to the class" : "Share important updates with your students"}
              <IoSparkles className="text-purple-400" />
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Textarea */}
          <div className="input-wrapper" style={{ animationDelay: '0.1s' }}>
            <label className="block text-xs font-semibold text-purple-300 mb-2 ml-1 tracking-wide uppercase">
              Message
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <textarea
                placeholder="Write your announcement here... Share updates, assignments, or important information with your class."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="relative w-full h-24 p-4 bg-white/5 border border-white/10 rounded-xl resize-none focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/30 transition-all outline-none text-gray-100 placeholder:text-gray-600 text-sm font-medium backdrop-blur-sm hover:border-purple-500/30 leading-relaxed"
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="input-wrapper" style={{ animationDelay: '0.2s' }}>
            <label className="block text-xs font-semibold text-indigo-300 mb-2 ml-1 tracking-wide uppercase">
              Attachment (Optional)
            </label>
            <label className="annouce-custom-file-upload group">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MdDriveFileMoveRtl size={20} className="text-indigo-400" />
                </div>
                <span className="font-semibold text-gray-300 group-hover:text-white transition-colors">Choose File</span>
              </div>
              <span className="annouce-file-chosen">
                {file ? file.name : editData?.fileUrl ? editData.fileUrl.split("/").pop() : "No file"}
              </span>
            </label>
          </div>

          {/* URL Input */}
          <div className="input-wrapper" style={{ animationDelay: '0.3s' }}>
            <label className="block text-xs font-semibold text-pink-300 mb-2 ml-1 tracking-wide uppercase">
              Link (Optional)
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <div className="absolute left-4 flex items-center pointer-events-none">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                    <FaLink className="text-pink-400 group-focus-within:text-pink-300 transition-colors duration-300" />
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Paste a video link, document URL, or any resource"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full pl-16 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-pink-500/50 focus:bg-white/10 focus:ring-2 focus:ring-pink-500/30 transition-all outline-none text-gray-100 placeholder:text-gray-600 text-sm font-medium backdrop-blur-sm hover:border-pink-500/30"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 input-wrapper" style={{ animationDelay: '0.4s' }}>
            <button 
              type="submit"
              className="relative w-full group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative w-full bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 hover:from-purple-500 hover:via-pink-400 hover:to-indigo-500 text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3">
                <FaPaperPlane className="text-lg" />
                {editData ? "Update Announcement" : "Post Announcement"}
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}