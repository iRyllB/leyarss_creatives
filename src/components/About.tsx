import { useEffect, useRef } from "react";
import "../styles/About.css";
import { useContent } from "../context/ContentContext";

export default function About() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const targets = Array.from(
      section.querySelectorAll<HTMLElement>(".scroll-reveal")
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  const {
    publishedContent: { about },
  } = useContent();

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="about-container">
        <div className="about-text">
          <h2 className="scroll-reveal reveal-delay-1">{about.title}</h2>

          <p className="scroll-reveal reveal-delay-2">{about.body}</p>
        </div>

        <div className="about-image scroll-reveal reveal-delay-3">
          <img src={about.image} alt="About Leyarss Creatives" />
        </div>
      </div>
    </section>
  );
}
