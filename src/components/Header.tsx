import "../styles/Header.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-container">
        <a href="#home" className="site-logo" aria-label="Go to homepage">
          <img src="/logo2.png" alt="Leyarss Creatives Logo" />
        </a>

        <nav className="site-nav">
          <a href="#home">HOME</a>
          <a href="#about">ABOUT</a>
          <a href="#services">SERVICES</a>
          <a href="#portfolio">PORTFOLIO</a>
        </nav>

        <button className="site-contact-btn">Contact Us</button>
      </div>
    </header>
  );
}