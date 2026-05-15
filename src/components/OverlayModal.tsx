import React from "react";
import "../styles/OverlayModal.css";


interface OverlayModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  image: string;
  description: string;
  onContactClick?: () => void;
}


const OverlayModal: React.FC<OverlayModalProps> = ({ open, onClose, title, image, description, onContactClick }) => {
  if (!open) return null;
  return (
    <div className="overlay-modal-backdrop" onClick={onClose}>
      <div className="overlay-modal-content overlay-modal-content-large" onClick={e => e.stopPropagation()}>
        <button className="overlay-modal-close" onClick={onClose}>&times;</button>
        <div className="overlay-modal-flex">
          <img src={image} alt={title} className="overlay-modal-image-large" />
          <div className="overlay-modal-info">
            <h2 className="overlay-modal-title-large">{title}</h2>
            <p className="overlay-modal-description-large">{description}</p>
            {onContactClick && (
              <button
                className="overlay-modal-contact-btn"
                onClick={() => {
                  onClose();
                  onContactClick();
                }}
              >
                Interested? Contact Us
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverlayModal;
