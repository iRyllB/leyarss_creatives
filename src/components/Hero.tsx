import "../styles/Hero.css";
import { useContent } from "../context/ContentContext";

type HeroProps = {
  onContactClick?: () => void;
};

export default function Hero({ onContactClick }: HeroProps) {
  const {
    publishedContent: { hero },
  } = useContent();

  return (
    <section className="hero" id="home">
      <div className="hero-overlay"></div>

      <div className="hero-container">
        <div className="hero-left">
          <h1>
            {hero.line1} <br />
            <span className="build-text">{hero.line2}</span> <br />
            <span className="print-text">{hero.line3}</span>
          </h1>

          <p>{hero.subtext}</p>

          <div className="hero-buttons">
            <button className="hero-brand-btn hero-btn-works">
              <span>VIEW OUR WORKS</span>
            </button>

            <button
              className="hero-brand-btn hero-btn-contact"
              type="button"
              onClick={onContactClick}
            >
              <span>CONTACT US</span>
            </button>
          </div>
        </div>

        <div className="hero-right">
          <img src={hero.image} alt="Leyarss Creatives Logo" />
        </div>
      </div>
    </section>
  );
}
