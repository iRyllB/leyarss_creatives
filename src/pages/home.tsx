import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Home.css";

export default function Home() {
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.site-header');
      if (window.scrollY > 10) {
        header.classList.add('site-header--scrolled');
      } else {
        header.classList.remove('site-header--scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Header />

      <div className="home">
        {/* HERO */}
        <section className="hero" id="home">
          <div className="hero-overlay"></div>

          <div className="hero-container">
            <div className="hero-left">
              <h1>
                WE DESIGN <br />
                <span className="build-text">WE BUILD</span> <br />
                <span className="print-text">WE PRINT</span>
              </h1>

              <p>Your Vision is Our Mission</p>

              <div className="hero-buttons">
                <button className="hero-brand-btn hero-btn-works">
                    <span>VIEW OUR WORKS</span>
                </button>

                <button className="hero-brand-btn hero-btn-contact">
                    <span>CONTACT US</span>
                </button>
              </div>
            </div>

            <div className="hero-right">
              <img src="/logo-large.png" alt="Leyarss Creatives Logo" />
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about" id="about">
          <div className="about-container">
            <div className="about-text">
              <h2>About Leyarss Creatives</h2>

              <p>
                At LEYARSS CREATIVES DESIGNS, our success is driven by a team of
                passionate creatives, strategic thinkers, and skilled
                professionals dedicated to bringing brands to life.
              </p>
            </div>

            <div className="about-image">
              <img src="/about.jpg" alt="About Leyarss Creatives" />
            </div>
          </div>
        </section>

        {/* SERVICES */}
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
      </div>

      <Footer />
    </>
  );
}