import React from "react";
import "../styles/OverlayModal.css";

interface OverlayModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  image: string;
  description: string;
}

const OverlayModal: React.FC<OverlayModalProps> = ({ open, onClose, title, image, description }) => {
  if (!open) return null;
  return (
    <div className="overlay-modal-backdrop" onClick={onClose}>
      <div className="overlay-modal-content" onClick={e => e.stopPropagation()}>
        <button className="overlay-modal-close" onClick={onClose}>&times;</button>
        <img src={image} alt={title} className="overlay-modal-image" />
        <h2 className="overlay-modal-title">{title}</h2>
        <p className="overlay-modal-description">{description}</p>
      </div>
    </div>
  );
};

export default OverlayModal;
