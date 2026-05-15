import { useEffect, useRef, useState } from "react";

import {
  type TabKey,
  type PortfolioItem,
  useContent,
} from "../context/ContentContext";
import "../styles/Portfolio.css";
import OverlayModal from "./OverlayModal";
import "../styles/OverlayModal.css";

type PortfolioProps = {
  onContactClick?: () => void;
};

export default function Portfolio({ onContactClick }: PortfolioProps) {
  const { publishedContent } = useContent();
  const [activeTab, setActiveTab] = useState<TabKey>("brand");
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Overlay modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<null | { title: string; image: string; description: string }>(null);

  const portfolioData = publishedContent.portfolio;
  const orderedKeys: TabKey[] = ["brand", "event", "print", "product"];

  const categories = orderedKeys.map((key) => ({
    key,
    label: portfolioData[key]?.title ?? key,
  }));

  const currentCategory = portfolioData[activeTab];
  const visibleItems = currentCategory?.items ?? [];
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

  // Open modal with item details
  const handleItemClick = (item: PortfolioItem) => {
    setModalData({
      title: item.title,
      image: item.image,
      description: item.details || "",
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalData(null);
  };

  const displayedItems = visibleItems.slice(
    currentIndex,
    currentIndex + itemsPerView
  );
  const displayedItemIds = displayedItems.map((item) => item.id).join("|");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const targets = Array.from(
      section.querySelectorAll<HTMLElement>(".portfolio-slider-item")
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
  }, [activeTab, currentIndex, displayedItemIds]);

  return (
    <section className="portfolio-slider" id="portfolio" ref={sectionRef}>
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
          <h3>{currentCategory?.title}</h3>
          <p>{currentCategory?.description}</p>
        </div>

        <div className="portfolio-slider-wrapper">
          <button className="slider-btn slider-btn-prev" onClick={handlePrev}>
            <span>{"<"}</span>
          </button>

          <div className="portfolio-slider-content">
            <div className="portfolio-items-track">
              {displayedItems.map((item: PortfolioItem) => (
                <div
                  className="portfolio-slider-item"
                  key={item.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="portfolio-item-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="portfolio-item-title">
                    <h5>{item.title}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="slider-btn slider-btn-next" onClick={handleNext}>
            <span>{">"}</span>
          </button>
        </div>

        <div className="slider-indicators">
          {Array.from({ length: Math.max(1, Math.ceil(visibleItems.length / itemsPerView)) }).map(
            (_, i) => (
              <div
                key={i}
                className={`indicator ${i === Math.floor(currentIndex / 1) ? "active" : ""}`}
              />
            )
          )}
        </div>
      </div>

      {/* Overlay Modal for Portfolio */}
      <OverlayModal
        open={modalOpen}
        onClose={handleModalClose}
        title={modalData?.title || ""}
        image={modalData?.image || ""}
        description={modalData?.description || ""}
        onContactClick={onContactClick}
      />
    </section>
  );
}
