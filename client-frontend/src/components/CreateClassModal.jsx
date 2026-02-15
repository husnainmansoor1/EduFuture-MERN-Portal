import React, { useState, useEffect } from "react";
import "../styles/CreateClassModal.css";
import { toast } from "react-toastify";
import { FaBook, FaGraduationCap, FaDoorOpen, FaPlus } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";

export default function CreateClassModal({
  openCreateModal,
  onClose,
  onSubmit,
  initialData = {},
  isEdit = false,
}) {
  const [form, setForm] = useState({ subject: "", program: "", room: "" });

  useEffect(() => {
    if (isEdit && initialData) {
      setForm({
        subject: initialData.subject || "",
        program: initialData.program || "",
        room: initialData.room || "",
      });
    }
  }, [initialData, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit === "function") {
      onSubmit(form);
      setTimeout(() => {
        toast.success(
          isEdit
            ? "Class updated successfully!"
            : "Class created successfully!",
          { autoClose: 2000 }
        );
      }, 500);

      setTimeout(() => {
        onClose();
        setForm({ subject: "", program: "", room: "" });
      }, 1500);
    } else {
      console.warn("onSubmit prop is not provided!");
      setTimeout(() => {
        toast.error("Something went wrong!", { autoClose: 2000 });
      }, 500);
    }
  };

  return (
    <div className="create-modal-overlay">
      <div className="create-modal-box">
        {/* Decorative gradient orbs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
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
              <div className="relative w-16 h-16 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 transform hover:scale-110 transition-transform duration-500">
                {isEdit ? (
                  <FaBook className="text-white text-2xl drop-shadow-lg" />
                ) : (
                  <FaPlus className="text-white text-2xl drop-shadow-lg" />
                )}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2 tracking-tight">
              {isEdit ? "Edit Classroom" : "Create New Class"}
            </h2>
            <p className="text-gray-400 text-sm font-light flex items-center justify-center gap-2">
              <IoSparkles className="text-purple-400" />
              {isEdit ? "Update your classroom information" : "Set up a new learning space"}
              <IoSparkles className="text-purple-400" />
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Input */}
          <div className="input-wrapper" style={{ animationDelay: '0.1s' }}>
            <label className="block text-xs font-semibold text-purple-300 mb-2 ml-1 tracking-wide uppercase">
              Subject
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <div className="absolute left-4 flex items-center pointer-events-none">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center">
                    <FaBook className="text-purple-400 group-focus-within:text-purple-300 transition-colors duration-300" />
                  </div>
                </div>
                <input
                  name="subject"
                  placeholder="e.g., Mathematics, Physics, Computer Science"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full pl-16 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/30 transition-all outline-none text-gray-100 placeholder:text-gray-600 text-sm font-medium backdrop-blur-sm hover:border-purple-500/30"
                />
              </div>
            </div>
          </div>

          {/* Program Input */}
          <div className="input-wrapper" style={{ animationDelay: '0.2s' }}>
            <label className="block text-xs font-semibold text-indigo-300 mb-2 ml-1 tracking-wide uppercase">
              Program
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <div className="absolute left-4 flex items-center pointer-events-none">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                    <FaGraduationCap className="text-indigo-400 group-focus-within:text-indigo-300 transition-colors duration-300" />
                  </div>
                </div>
                <input
                  name="program"
                  placeholder="e.g., BS Computer Science, MS Data Science"
                  value={form.program}
                  onChange={handleChange}
                  required
                  className="w-full pl-16 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500/50 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/30 transition-all outline-none text-gray-100 placeholder:text-gray-600 text-sm font-medium backdrop-blur-sm hover:border-indigo-500/30"
                />
              </div>
            </div>
          </div>

          {/* Room Input */}
          <div className="input-wrapper" style={{ animationDelay: '0.3s' }}>
            <label className="block text-xs font-semibold text-pink-300 mb-2 ml-1 tracking-wide uppercase">
              Room Number
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <div className="absolute left-4 flex items-center pointer-events-none">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                    <FaDoorOpen className="text-pink-400 group-focus-within:text-pink-300 transition-colors duration-300" />
                  </div>
                </div>
                <input
                  name="room"
                  placeholder="e.g., Room 101, Lab A, Hall 3"
                  value={form.room}
                  onChange={handleChange}
                  required
                  className="w-full pl-16 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-pink-500/50 focus:bg-white/10 focus:ring-2 focus:ring-pink-500/30 transition-all outline-none text-gray-100 placeholder:text-gray-600 text-sm font-medium backdrop-blur-sm hover:border-pink-500/30"
                />
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="pt-4 input-wrapper" style={{ animationDelay: '0.4s' }}>
            <button 
              className="relative w-full group overflow-hidden" 
              type="submit"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative w-full bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 hover:from-purple-500 hover:via-pink-400 hover:to-indigo-500 text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3">
                {isEdit ? (
                  <>
                    <FaBook className="text-lg" />
                    Update Classroom
                  </>
                ) : (
                  <>
                    <FaPlus className="text-lg" />
                    Create Classroom
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