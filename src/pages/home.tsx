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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openContactModal = () => setIsContactOpen(true);
  const closeContactModal = () => setIsContactOpen(false);

  return (
    <>
      <Header onContactClick={openContactModal} />

      <div className="home">
        <Hero onContactClick={openContactModal} />
        <About />
        <Services />
        <Portfolio />
      </div>

      <Footer />

      <Form isOpen={isContactOpen} onClose={closeContactModal} />
    </>
  );
}
