import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import "../styles/Form.css";

type FormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Form({ isOpen, onClose }: FormProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="contact-overlay">
      <div className="contact-backdrop" onClick={onClose} />

      <div className="contact-modal">
        <button className="contact-close" onClick={onClose}>×</button>

        <header className="contact-header">
          <h2>
            Let's <span>Connect</span>
          </h2>

          <p>
            Have a vision? We have the tools. Drop us a message and
            let's create something extraordinary together.
          </p>
        </header>

        <form className="contact-form">
          <div className="contact-grid">

            <label>
              FULL NAME
              <input
                type="text"
                placeholder="John Doe"
                className="contact-input"
              />
            </label>

            <label>
              EMAIL ADDRESS
              <input
                type="email"
                placeholder="john@example.com"
                className="contact-input"
              />
            </label>

          </div>

          <label className="contact-field">
            YOUR MESSAGE
            <textarea
              className="contact-textarea"
              placeholder="Tell us about your project or inquiry..."
            />
          </label>

          <button className="contact-submit">
            SEND MESSAGE ▷
          </button>
        </form>

        <div className="contact-divider" />

        <div className="contact-social">

          <p>CONTACT US ON SOCIAL MEDIA TOO</p>

          <div className="social-icons">

            <div className="social-item">
              <div className="icon-circle">
                <Facebook size={20}/>
              </div>
              <span>FACEBOOK</span>
            </div>

            <div className="social-item">
              <div className="icon-circle">
                <Instagram size={20}/>
              </div>
              <span>INSTAGRAM</span>
            </div>

            <div className="social-item">
              <div className="icon-circle">
                <Linkedin size={20}/>
              </div>
              <span>LINKEDIN</span>
            </div>

          </div>

        </div>

      </div>
    </div>,
    document.body
  );
}