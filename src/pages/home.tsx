import { useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import Portfolio from "../components/Portfolio";
import Footer from "../components/Footer";
import Form from "../components/Form";
import "../styles/home.css";

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".site-header");
      if (header) {
        if (window.scrollY > 10) {
          header.classList.add("site-header--scrolled");
        } else {
          header.classList.remove("site-header--scrolled");
        }
      }

      setShowBackToTop(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal-on-scroll")
    );

    if (revealItems.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${index * 80}ms`);
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  const openContactModal = () => setIsContactOpen(true);
  const closeContactModal = () => setIsContactOpen(false);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header onContactClick={openContactModal} />

      <div className="home">
        <div className="reveal-on-scroll reveal-hero revealed">
          <Hero onContactClick={openContactModal} />
        </div>
        <div className="reveal-on-scroll reveal-about">
          <About />
        </div>
        <div className="reveal-on-scroll reveal-services">
          <Services />
        </div>
        <div className="reveal-on-scroll reveal-portfolio">
          <Portfolio />
        </div>
      </div>

      <Footer />

      <button
        type="button"
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        ↑
      </button>

      <Form isOpen={isContactOpen} onClose={closeContactModal} />
    </>
  );
}
