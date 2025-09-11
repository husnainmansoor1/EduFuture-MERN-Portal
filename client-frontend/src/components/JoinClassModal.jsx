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
        <div className="modal-box-container">
          <button className="modal-close-btn" onClick={onClose}>
            <AiOutlineClose size={22} />
          </button>

          <h2>Join Class</h2>
          <p className="join-instruction">
            Ask your teacher for the class code, then enter it here.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter class code (e.g., ABC123)"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              className="modal-input class-code-input"
              maxLength={6}
              disabled={loading}
              autoFocus
            />

            <button
              type="submit"
              className="modal-button"
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
