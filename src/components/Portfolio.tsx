import React from "react";
import "../styles/Portfolio.css";

export default function Portfolio() {
  const portfolioItems = [
    {
      id: 1,
      title: "Modern Brand Identity",
      category: "Branding",
      image: "/portfolio-1.jpg",
      description: "Complete brand identity system including logo, colors, and typography guidelines.",
    },
    {
      id: 2,
      title: "Digital Marketing Campaign",
      category: "Marketing",
      image: "/portfolio-2.jpg",
      description: "Comprehensive digital campaign across multiple platforms with stunning visuals.",
    },
    {
      id: 3,
      title: "Product Design Showcase",
      category: "Design",
      image: "/portfolio-3.jpg",
      description: "Innovation-driven product design that combines aesthetics with functionality.",
    },
    {
      id: 4,
      title: "Corporate Print Materials",
      category: "Print",
      image: "/portfolio-4.jpg",
      description: "Professional print design including business cards, letterheads, and brochures.",
    },
    {
      id: 5,
      title: "Website Development",
      category: "Web",
      image: "/portfolio-5.jpg",
      description: "Modern, responsive website design and development with excellent UX.",
    },
    {
      id: 6,
      title: "Creative Packaging",
      category: "Packaging",
      image: "/portfolio-6.jpg",
      description: "Eye-catching packaging design that tells your brand story and stands out.",
    },
  ];

  return (
    <section className="portfolio" id="portfolio">
      <div className="portfolio-container">
        <div className="portfolio-header">
          <h2>Our Portfolio</h2>
          <p>Explore our latest and greatest creative works.</p>
        </div>

        <div className="portfolio-grid">
          {portfolioItems.map((item) => (
            <div className="portfolio-card" key={item.id}>
              <div className="portfolio-image-wrapper">
                <img src={item.image} alt={item.title} />
                <div className="portfolio-overlay">
                  <div className="portfolio-content">
                    <h3>{item.title}</h3>
                    <p className="portfolio-category">{item.category}</p>
                  </div>
                </div>
              </div>
              <div className="portfolio-info">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <p className="portfolio-cat-tag">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
