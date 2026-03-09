import React from "react";
import "../styles/Services.css";

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="services-container">
        <h2>Our Services</h2>

        <p className="services-desc">
          Our customers entrust us with bringing you the latest and most
          innovative products.
        </p>

        <div className="services-grid">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div className="service-card" key={s}>
              <div className="service-icon"></div>
              <h3>Service {s}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
