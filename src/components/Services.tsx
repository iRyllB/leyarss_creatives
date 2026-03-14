import "../styles/Services.css";

export default function Services() {
  const servicesData = [
    {
      id: 1,
      title: "Brand Identity Design",
      category: "Branding",
      image: "/service-1.jpg",
      description: "Create a distinctive brand identity that stands out in the market.",
    },
    {
      id: 2,
      title: "Digital Design & UX",
      category: "Digital",
      image: "/service-2.jpg",
      description: "Modern, user-centric digital designs for web and mobile platforms.",
    },
    {
      id: 3,
      title: "Print & Packaging",
      category: "Print",
      image: "/service-3.jpg",
      description: "Professional print design solutions including packaging and marketing materials.",
    },
    {
      id: 4,
      title: "Event Branding",
      category: "Events",
      image: "/service-4.jpg",
      description: "Complete branding solutions for corporate events and special occasions.",
    },
    {
      id: 5,
      title: "Marketing Materials",
      category: "Marketing",
      image: "/service-5.jpg",
      description: "Engaging marketing collateral that drives brand awareness and conversions.",
    },
    {
      id: 6,
      title: "Consultation & Strategy",
      category: "Consulting",
      image: "/service-6.jpg",
      description: "Expert guidance on brand strategy and creative direction for your projects.",
    },
  ];

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
