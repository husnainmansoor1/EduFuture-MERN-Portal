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
        <button className="modal-close-icon" onClick={onClose}>
          ✕
        </button>

        <h2>{isEdit ? "Edit Class Room" : "Create Class Room"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="subject"
            placeholder="Subject Name"
            value={form.subject}
            onChange={handleChange}
            required
          />
          <input
            name="program"
            placeholder="Program Name"
            value={form.program}
            onChange={handleChange}
            required
          />
          <input
            name="room"
            placeholder="Room"
            value={form.room}
            onChange={handleChange}
            required
          />
          <button className="create-modal-button" type="submit">
            {isEdit ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
