import React, { useState, useEffect } from "react";
import "../styles/CreateClassModal.css";
import { toast } from "react-toastify";

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
        <button 
          className="absolute top-2.5 right-3 bg-transparent border-none text-xl font-bold text-[var(--cross-bar-color)] cursor-pointer transition-colors duration-200 hover:text-[#e74c3c]" 
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="mb-4 text-center text-[var(--text-color)]">
          {isEdit ? "Edit Class Room" : "Create Class Room"}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <input
            name="subject"
            placeholder="Subject Name"
            value={form.subject}
            onChange={handleChange}
            required
            className="block w-full mb-4 p-2.5 border border-gray-300 bg-gray-200 rounded-xl text-[var(--input-text)] focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="program"
            placeholder="Program Name"
            value={form.program}
            onChange={handleChange}
            required
            className="block w-full mb-4 p-2.5 border border-gray-300 bg-gray-200 rounded-xl text-[var(--input-text)] focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="room"
            placeholder="Room"
            value={form.room}
            onChange={handleChange}
            required
            className="block w-full mb-4 p-2.5 border border-gray-300 bg-gray-200 rounded-xl text-[var(--input-text)] focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          
          <button 
            className="w-full bg-[#2ecc71] text-[var(--text-color)] py-2.5 px-4 border-none rounded cursor-pointer transition-colors duration-200 hover:bg-[#27ae60] mt-2.5 mb-2.5" 
            type="submit"
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}