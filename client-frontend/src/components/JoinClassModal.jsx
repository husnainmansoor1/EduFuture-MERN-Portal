import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import "../styles/JoinClassModal.css";

export default function JoinClassModal({ onClose, onSubmit }) {
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!classCode.trim()) {
      setTimeout(() => {
        toast.error("Please enter a class code", { autoClose: 2500 });
      }, 500); 
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ code: classCode.trim() });

      setTimeout(() => {
        toast.success("Successfully joined the class!", { autoClose: 3000 });
      }, 500);

      setClassCode("");

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error joining class:", error);

      setTimeout(() => {
        toast.error("Failed to join class. Try again!", { autoClose: 3000 });
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="flex flex-col ml-4">
          <button className="modal-close-btn" onClick={onClose}>
            <AiOutlineClose size={22} />
          </button>

          <h2 className="mb-2.5 text-center text-2xl font-semibold text-[var(--text-color)]">
            Join Class
          </h2>
          <p className="text-center text-sm leading-5 text-[var(--sub-text)] mb-6">
            Ask your teacher for the class code, then enter it here.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter class code (e.g., ABC123)"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              className="block w-[95%] mb-5 p-4 border-2 rounded-lg text-center text-lg font-semibold tracking-wider text-[var(--input-text)] border-[var(--border-color)] focus:border-[var(--primary-btn)] focus:outline-none focus:shadow-[0_0_0_3px_rgba(26,115,232,0.1)] transition-colors duration-300"
              maxLength={6}
              disabled={loading}
              autoFocus
            />

            <button
              type="submit"
              className="block w-[95%] p-4 border-none rounded-lg cursor-pointer text-base font-medium my-2.5 text-white bg-[var(--primary-btn)] hover:bg-[var(--primary-btn-hover)] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-300"
              disabled={loading || !classCode.trim()}
            >
              {loading ? "Joining..." : "Join Class"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}