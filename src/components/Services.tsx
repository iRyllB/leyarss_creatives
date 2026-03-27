import { useEffect, useRef } from "react";
import { useContent } from "../context/ContentContext";
import "../styles/Services.css";

export default function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { publishedContent } = useContent();
  const servicesData = publishedContent.services;
  const serviceIds = servicesData.map((service) => service.id).join("|");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const targets = Array.from(
      section.querySelectorAll<HTMLElement>(".service-card")
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
  }, [serviceIds]);

  return (
    <section className="services" id="services" ref={sectionRef}>
      <div className="services-container">
        <div className="services-header">
          <h2>Our Services</h2>
          <p>
            Our customers entrust us with bringing you the latest and most
            innovative products.
          </p>
        </div>

        <div className="services-grid">
          {servicesData.map((service: (typeof servicesData)[number]) => (
            <div className="service-card" key={service.id}>
              <div className="service-image-wrapper">
                <img src={service.image} alt={service.title} />
                <div className="service-overlay">
                  <div className="service-content">
                    <h3>{service.title}</h3>
                    <p className="service-category">{service.category}</p>
                  </div>
                </div>
              </div>
              <div className="service-info">
                <h4>{service.title}</h4>
                <p>{service.description}</p>
                <p className="service-cat-tag">{service.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
