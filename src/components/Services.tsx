import { useContent } from "../context/ContentContext";
import "../styles/Services.css";

export default function Services() {
  const { content } = useContent();
  const servicesData = content.services;

  return (
    <section className="services" id="services">
      <div className="services-container">
        <div className="services-header">
          <h2>Our Services</h2>
          <p>
            Our customers entrust us with bringing you the latest and most
            innovative products.
          </p>
        </div>

        <div className="services-grid">
          {servicesData.map((service) => (
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
