import React, { useEffect } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import Portfolio from "../components/Portfolio";
import Footer from "../components/Footer";
import "../styles/Home.css";

export default function Home() {
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.site-header');
      if (header) {
        if (window.scrollY > 10) {
          header.classList.add('site-header--scrolled');
        } else {
          header.classList.remove('site-header--scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Header />

      <div className="home">
        <Hero />
        <About />
        <Services />
        <Portfolio />
      </div>

      <Footer />
    </>
  );
}