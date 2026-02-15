import { useState } from "react";
import { FaUserPlus, FaKey } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { toast } from "react-toastify";
import "../styles/JoinClassModal.css";

export default function JoinClassModal({ onClose, onSubmit }) {
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedCode = classCode.trim();

    if (!trimmedCode) {
      toast.error("Please enter a class code", { autoClose: 2500, toastId: "empty-code" });
      return;
    }

    setLoading(true);
    try {
      // ✅ send string directly and wait for result
      const success = await onSubmit(trimmedCode);

      if (success) {
        setClassCode("");
        onClose();
      }
      // If success is false, modal stays open, and parent handles the error toast
    } catch (error) {
      console.error("Join class error:", error);
      // Parent handles specific errors, this is a fallback
      toast.error("An unexpected error occurred", { autoClose: 3000, toastId: "modal-error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-modal-overlay">
      <div className="join-modal-box">
        {/* Decorative gradient orbs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
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
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-600 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/50 transform hover:scale-110 transition-transform duration-500">
                <FaUserPlus className="text-white text-2xl drop-shadow-lg" />
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 tracking-tight">
              Join Class
            </h2>
            <p className="text-gray-400 text-sm font-light flex items-center justify-center gap-2">
              <IoSparkles className="text-cyan-400" />
              Enter the class code from your teacher
              <IoSparkles className="text-cyan-400" />
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Class Code Input */}
          <div className="input-wrapper" style={{ animationDelay: '0.1s' }}>
            <label className="block text-xs font-semibold text-cyan-300 mb-2 ml-1 tracking-wide uppercase">
              Class Code
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <div className="absolute left-4 flex items-center pointer-events-none">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                    <FaKey className="text-cyan-400 group-focus-within:text-cyan-300 transition-colors duration-300" />
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="e.g., dAXvdA"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  maxLength={6}
                  disabled={loading}
                  autoFocus
                  className="w-full pl-16 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-500/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-500/30 transition-all outline-none text-gray-100 placeholder:text-gray-600 text-sm font-bold tracking-widest text-center backdrop-blur-sm hover:border-cyan-500/30"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 input-wrapper" style={{ animationDelay: '0.2s' }}>
            <button 
              type="submit"
              disabled={loading || !classCode.trim()}
              className="relative w-full group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative w-full bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-600 hover:from-cyan-500 hover:via-blue-400 hover:to-purple-500 text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 disabled:transform-none disabled:shadow-none">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Joining...
                  </>
                ) : (
                  <>
                    <FaUserPlus className="text-lg" />
                    Join Class
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
