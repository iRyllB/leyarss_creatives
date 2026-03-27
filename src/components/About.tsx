import "../styles/About.css";
import { useContent } from "../context/ContentContext";

export default function About() {
  const {
    publishedContent: { about },
  } = useContent();

  return (
    <section className="about" id="about">
      <div className="about-container">
        <div className="about-text">
          <h2>{about.title}</h2>

          <p>{about.body}</p>
        </div>

        <div className="about-image">
          <img src={about.image} alt="About Leyarss Creatives" />
        </div>
      </div>
    </section>
  );
}
