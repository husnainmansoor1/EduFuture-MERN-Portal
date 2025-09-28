// Confirm Dialog Component
export function ConfirmDialog({ show, onConfirm, onCancel }) {
  if (!show) return null;
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h3>Are you sure?</h3>
        <p>This action cannot be undone.</p>
        <div className="confirm-actions">
          <button className="confirm-btn delete" onClick={onConfirm}>
            <span> Delete</span>
          </button>
          <button className="confirm-btn cancel" onClick={onCancel}>
           <span> Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
}