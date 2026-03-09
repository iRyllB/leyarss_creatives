import { useState } from "react";
import "../styles/Portfolio.css";

type TabKey = "brand" | "event" | "print" | "product";

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<TabKey>("brand");
  const [currentIndex, setCurrentIndex] = useState(0);

  const portfolioData = {
    brand: {
      title: "Brand Development",
      description: "Comprehensive brand identity solutions",
      items: [
        {
          id: 1,
          title: "Tech Startup Identity",
          image: "/portfolio-brand-1.jpg",
          details: "Full brand identity with logo, guidelines, and digital coloring system",
        },
        {
          id: 2,
          title: "Luxury Cosmetics Branding",
          image: "/portfolio-brand-2.jpg",
          details: "Elegant brand identity for premium beauty line",
        },
        {
          id: 3,
          title: "Eco-Friendly Brand",
          image: "/portfolio-brand-3.jpg",
          details: "Sustainable and eco-conscious brand identity system",
        },
        {
          id: 4,
          title: "Restaurant Brand Design",
          image: "/portfolio-brand-4.jpg",
          details: "Complete restaurant branding with packaging and collateral",
        },
      ],
    },
    event: {
      title: "Event Branding",
      description: "From concept to execution with iconic branding",
      items: [
        {
          id: 5,
          title: "Tech Conference 2026",
          image: "/portfolio-event-1.jpg",
          details: "Complete event branding including signage and digital assets",
        },
        {
          id: 6,
          title: "Music Festival Branding",
          image: "/portfolio-event-2.jpg",
          details: "Festival identity with posters, merchandise, and stage design",
        },
        {
          id: 7,
          title: "Corporate Gala Design",
          image: "/portfolio-event-3.jpg",
          details: "Elegant branding for high-end corporate event",
        },
        {
          id: 8,
          title: "Charity Fundraiser Event",
          image: "/portfolio-event-4.jpg",
          details: "Impactful branding for annual charity fundraiser",
        },
      ],
    },
    print: {
      title: "Print Design",
      description: "Tangible designs that make an impression",
      items: [
        {
          id: 9,
          title: "Premium Business Cards",
          image: "/portfolio-print-1.jpg",
          details: "Luxury business card design with special finishes",
        },
        {
          id: 10,
          title: "Annual Report Design",
          image: "/portfolio-print-2.jpg",
          details: "Professional annual report with photography and typography",
        },
        {
          id: 11,
          title: "Brochure & Catalog",
          image: "/portfolio-print-3.jpg",
          details: "Comprehensive brochure design with product showcase",
        },
        {
          id: 12,
          title: "Packaging Design",
          image: "/portfolio-print-4.jpg",
          details: "Eye-catching packaging that reflects brand values",
        },
      ],
    },
    product: {
      title: "Product Design",
      description: "Innovation meets creativity in product solutions",
      items: [
        {
          id: 13,
          title: "Mobile App Interface",
          image: "/portfolio-product-1.jpg",
          details: "User-centric mobile app design with intuitive interface",
        },
        {
          id: 14,
          title: "Web Platform Design",
          image: "/portfolio-product-2.jpg",
          details: "Complete web platform design with responsive layouts",
        },
        {
          id: 15,
          title: "Product Packaging Mockup",
          image: "/portfolio-product-3.jpg",
          details: "3D product design and packaging visualization",
        },
        {
          id: 16,
          title: "Interactive Dashboard",
          image: "/portfolio-product-4.jpg",
          details: "Analytics dashboard with data visualization and UX design",
        },
      ],
    },
  };

  const categories: { key: TabKey; label: string }[] = [
    { key: "brand", label: "Brand Development" },
    { key: "event", label: "Event Branding" },
    { key: "print", label: "Print Design" },
    { key: "product", label: "Product Design" },
  ];

  const currentCategory = portfolioData[activeTab];
  const visibleItems = currentCategory.items;
  const itemsPerView = 3;
  const maxIndex = Math.max(0, visibleItems.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setCurrentIndex(0);
  };

  const displayedItems = visibleItems.slice(
    currentIndex,
    currentIndex + itemsPerView
  );

  return (
    <section className="portfolio-slider" id="portfolio">
      <div className="portfolio-slider-container">
        <div className="portfolio-slider-header">
          <h2>Our Portfolio</h2>
          <p>Explore our creative work across multiple categories</p>
        </div>

        <div className="portfolio-tabs">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`portfolio-tab ${activeTab === cat.key ? "active" : ""}`}
              onClick={() => handleTabChange(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="portfolio-category-info">
          <h3>{currentCategory.title}</h3>
          <p>{currentCategory.description}</p>
        </div>

        <div className="portfolio-slider-wrapper">
          <button className="slider-btn slider-btn-prev" onClick={handlePrev}>
            <span>←</span>
          </button>

          <div className="portfolio-slider-content">
            <div className="portfolio-items-track">
              {displayedItems.map((item: { id: number; image: string; title: string; details: string }) => (
                <div className="portfolio-slider-item" key={item.id}>
                  <div className="portfolio-item-image">
                    <img src={item.image} alt={item.title} />
                    <div className="portfolio-item-overlay">
                      <h4>{item.title}</h4>
                      <p>{item.details}</p>
                    </div>
                  </div>
                  <div className="portfolio-item-title">
                    <h5>{item.title}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="slider-btn slider-btn-next" onClick={handleNext}>
            <span>→</span>
          </button>
        </div>

        <div className="slider-indicators">
          {Array.from({ length: Math.ceil(visibleItems.length / itemsPerView) }).map(
            (_, i) => (
              <div
                key={i}
                className={`indicator ${i === Math.floor(currentIndex / 1) ? "active" : ""}`}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
