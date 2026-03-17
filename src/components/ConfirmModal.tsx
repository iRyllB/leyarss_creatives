import "../styles/ConfirmModal.css";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "Please confirm this action.",
  confirmLabel = "Yes, continue",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="confirm-backdrop" role="dialog" aria-modal="true">
      <div className="confirm-card">
        <div className="confirm-header">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
        <div className="confirm-actions">
          <button className="ghost-btn" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="primary-btn" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
