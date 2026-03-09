import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Home.css";

export default function Home() {
  return (
    <>
      {/* shared header component */}
      <Header />

      <div className="home">


      {/* HERO */}
      <section className="hero">

        <div className="hero-container">

          <div className="hero-left">

            <h1>
              WE DESIGN <br/>
              WE BUILD <br/>
              <span>WE PRINT</span>
            </h1>

            <p>Your Vision is Our Mission</p>

            <div className="hero-buttons">
              <button className="btn-primary">
                VIEW OUR WORKS
              </button>

              <button className="btn-outline">
                CONTACT US
              </button>
            </div>

          </div>

          <div className="hero-right">
            <img src="/logo-large.png"/>
          </div>

        </div>

      </section>


      {/* ABOUT */}
      <section className="about">

        <div className="about-container">

          <div className="about-text">

            <h2>About Leyarss Creatives</h2>

            <p>
              At LEYARSS CREATIVES DESIGNS, our success is driven by a team of
              passionate creatives, strategic thinkers, and skilled professionals
              dedicated to bringing brands to life.
            </p>

          </div>

          <div className="about-image">
            <img src="/about.jpg"/>
          </div>

        </div>

      </section>


      {/* SERVICES */}
      <section className="services">

        <div className="services-container">

          <h2>Our Services</h2>

          <p className="services-desc">
            Our customers entrust us with bringing you the latest and most
            innovative products.
          </p>

          <div className="services-grid">

            {[1,2,3,4,5,6].map((s)=>(
              <div className="service-card" key={s}>
                <div className="service-icon"></div>
                <h3>Service {s}</h3>
              </div>
            ))}

          </div>

        </div>

      </section>

    </div>

      {/* shared footer component */}
      <Footer />
    </>
  )
}