import "../styles/Hero.css";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-overlay"></div>

      <div className="hero-container">
        <div className="hero-left">
          <h1>
            WE DESIGN <br />
            <span className="build-text">WE BUILD</span> <br />
            <span className="print-text">WE PRINT</span>
          </h1>

          <p>Your Vision is Our Mission</p>

          <div className="hero-buttons">
            <button className="hero-brand-btn hero-btn-works">
              <span>VIEW OUR WORKS</span>
            </button>

            <button className="hero-brand-btn hero-btn-contact">
              <span>CONTACT US</span>
            </button>
          </div>
        </div>

        <div className="hero-right">
          <img src="/logo-large.png" alt="Leyarss Creatives Logo" />
        </div>
      </div>
    </section>
  );
}
