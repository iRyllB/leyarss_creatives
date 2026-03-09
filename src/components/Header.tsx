import "../styles/Header.css"

export default function Header() {
  return (
    <header className="header">

      <div className="header-container">

        <div className="logo">
          <img src="/logo.png" />
        </div>

        <nav className="nav">
          <a>HOME</a>
          <a>ABOUT</a>
          <a>SERVICES</a>
          <a>PORTFOLIO</a>
        </nav>

        <button className="contact-btn">
          Contact Us
        </button>

      </div>

    </header>
  )
}