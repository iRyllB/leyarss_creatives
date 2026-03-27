import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Facebook, Instagram, Music2 } from "lucide-react";
import "../styles/Form.css";

type FormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Form({ isOpen, onClose }: FormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const socialLinks = [
    {
      href: "https://www.facebook.com/leyarsscreative",
      label: "FACEBOOK",
      icon: Facebook,
    },
    {
      href: "https://www.instagram.com/leyarsscreative",
      label: "INSTAGRAM",
      icon: Instagram,
    },
    {
      href: "https://www.tiktok.com/@leyarsscreative",
      label: "TIKTOK",
      icon: Music2,
    },
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setFormMessage("Please complete all fields before sending.");
      return;
    }

    const subject = encodeURIComponent(`Project Inquiry from ${trimmedName}`);
    const body = encodeURIComponent(
      `Hi Leyarss Creatives,%0D%0A%0D%0AName: ${trimmedName}%0D%0AEmail: ${trimmedEmail}%0D%0A%0D%0AMessage:%0D%0A${trimmedMessage}`
    );

    window.location.href = `mailto:leyarsscreative@gmail.com?subject=${subject}&body=${body}`;
    setFormMessage("Opening your email app to send this message.");
  };

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

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-grid">

            <label>
              FULL NAME
              <input
                type="text"
                placeholder="John Doe"
                className="contact-input"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </label>

            <label>
              EMAIL ADDRESS
              <input
                type="email"
                placeholder="john@example.com"
                className="contact-input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

          </div>

          <label className="contact-field">
            YOUR MESSAGE
            <textarea
              className="contact-textarea"
              placeholder="Tell us about your project or inquiry..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
            />
          </label>

          <button className="contact-submit" type="submit">
            SEND VIA EMAIL ▷
          </button>

          <p className="contact-form-note">
            No automated inbox is connected yet. This opens your email app with your message pre-filled.
          </p>

          {formMessage ? <p className="contact-form-feedback">{formMessage}</p> : null}
        </form>

        <div className="contact-divider" />

        <div className="contact-social">

          <p>CONTACT US ON SOCIAL MEDIA TOO</p>

          <div className="social-icons">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="social-item"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                title={link.label}
              >
                <span className="icon-circle" aria-hidden="true">
                  <link.icon size={20} />
                </span>
                <span>{link.label}</span>
              </a>
            ))}

          </div>

        </div>

      </div>
    </div>,
    document.body
  );
}