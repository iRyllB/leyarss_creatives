import "../styles/Footer.css";
import { Facebook, Instagram, Music2 } from "lucide-react";

const socialLinks = [
  {
    href: "https://www.facebook.com/leyarsscreative",
    label: "Facebook",
    icon: Facebook,
  },
  {
    href: "https://www.instagram.com/leyarsscreative",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://www.tiktok.com/@leyarsscreative",
    label: "TikTok",
    icon: Music2,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
      <footer className="footer">

        <div className="footer-container">

          <div className="footer-brand">
            <img src="/logo.png" alt="Leyarss Logo"/>
            
            <div className="socials">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  title={link.label}
                >
                  <link.icon size={18} strokeWidth={2.1} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h3>Quick Links</h3>
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#services">Services</a>
            <a href="#portfolio">Portfolio</a>
          </div>

          <div className="footer-col">
            <h3>Contact Details</h3>
            <p>
              leyarsscreative@gmail.com<br/>
              +63 962 284 3247
            </p>
            <p>
              Iponan, Cagayan De Oro<br/>
              9000 Misamis Oriental
            </p>
          </div>

          <div className="footer-col">
            <h3>Admin</h3>
            <a 
            href="/adminlogin" 
            className="admin-login-btn"
            target="_blank"
            rel="noopener noreferrer">
              Admin Login
            </a>
          </div>

        </div>

        <div className="footer-line"/>

        <p className="copyright">
          © {currentYear} Leyarss Creatives. All rights reserved.
        </p>

      </footer>
  );
}