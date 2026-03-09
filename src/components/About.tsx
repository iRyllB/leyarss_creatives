import "../styles/About.css";

export default function About() {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <div className="about-text">
          <h2>About Leyarss Creatives</h2>

          <p>
            At LEYARSS CREATIVES DESIGNS, our success is driven by a team of
            passionate creatives, strategic thinkers, and skilled
            professionals dedicated to bringing brands to life.
          </p>
        </div>

        <div className="about-image">
          <img src="/about.jpg" alt="About Leyarss Creatives" />
        </div>
      </div>
    </section>
  );
}
