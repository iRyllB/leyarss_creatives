import { useEffect, useMemo, useState } from "react";
import "../styles/Header.css";

export default function Header() {
  const navItems = useMemo(
    () => [
      { label: "HOME", href: "#home", id: "home" },
      { label: "ABOUT", href: "#about", id: "about" },
      { label: "SERVICES", href: "#services", id: "services" },
      { label: "PORTFOLIO", href: "#portfolio", id: "portfolio" },
    ],
    []
  );

  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const headerOffset = 110;
      let currentSection = "home";

      for (const item of navItems) {
        const section = document.getElementById(item.id);
        if (!section) continue;

        const sectionTop = section.offsetTop - headerOffset;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
          currentSection = item.id;
        }
      }

      setActiveSection(currentSection);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  return (
    <header className={`site-header ${isScrolled ? "site-header--scrolled" : ""}`}>
      <div className="site-header-container">
        <a href="#home" className="site-logo" aria-label="Go to homepage">
          <img src="/logo2.png" alt="Leyarss Creatives Logo" />
        </a>

        <nav className="site-nav">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`site-nav-link ${activeSection === item.id ? "is-active" : ""}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button className="site-contact-btn">Contact Us</button>
      </div>
    </header>
  );
}