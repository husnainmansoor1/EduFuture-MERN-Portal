import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import "../styles/JoinClassModal.css";

export default function JoinClassModal({ onClose, onSubmit }) {
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedCode = classCode.trim();

    if (!trimmedCode) {
      toast.error("Please enter a class code", { autoClose: 2500 });
      return;
    }

    setLoading(true);
    try {
      // ✅ send string directly
      await onSubmit(trimmedCode);

      setClassCode("");
      onClose();
    } catch (error) {
      console.error("Join class error:", error);
      toast.error("Failed to join class. Try again!", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
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
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            maxLength={6}
            disabled={loading}
            autoFocus
            className="block w-[95%] mb-5 p-4 border-2 rounded-lg text-center text-lg font-semibold tracking-wider
              text-[var(--input-text)] border-[var(--border-color)]
              focus:border-[var(--primary-btn)] focus:outline-none
              focus:shadow-[0_0_0_3px_rgba(26,115,232,0.1)]
              transition-colors duration-300"
          />

          <button
            type="submit"
            disabled={loading || !classCode.trim()}
            className="block w-[95%] p-4 rounded-lg text-base font-medium my-2.5 text-white
              bg-[var(--primary-btn)] hover:bg-[var(--primary-btn-hover)]
              disabled:bg-gray-300 disabled:cursor-not-allowed
              transition-colors duration-300"
          >
            {loading ? "Joining..." : "Join Class"}
          </button>
        </form>
      </div>
    </div>
  );
}
