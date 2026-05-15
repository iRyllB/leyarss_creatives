
import { useEffect, useRef, useState } from "react";
import { useContent } from "../context/ContentContext";
import "../styles/Services.css";
import OverlayModal from "./OverlayModal";
import "../styles/OverlayModal.css";

export default function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { publishedContent } = useContent();
  const servicesData = publishedContent.services;
  const serviceIds = servicesData.map((service) => service.id).join("|");

  // Overlay modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<null | { title: string; image: string; description: string }>(null);

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

  // Open modal with service details
  const handleServiceClick = (service: (typeof servicesData)[number]) => {
    setModalData({
      title: service.title,
      image: service.image,
      description: service.description || service.category || "",
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalData(null);
  };

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
            <div
              className="service-card"
              key={service.id}
              style={{ cursor: "pointer" }}
              onClick={() => handleServiceClick(service)}
            >
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

      {/* Overlay Modal for Services */}
      <OverlayModal
        open={modalOpen}
        onClose={handleModalClose}
        title={modalData?.title || ""}
        image={modalData?.image || ""}
        description={modalData?.description || ""}
      />
    </section>
  );
}
