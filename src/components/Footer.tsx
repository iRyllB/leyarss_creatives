import "../styles/Footer.css"

export default function Footer(){
  return(
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <img src="/logo.png"/>
          
          <div className="socials">
            <div className="circle"/>
            <div className="circle"/>
            <div className="circle"/>
          </div>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <p>Home</p>
          <p>About Us</p>
          <p>Services</p>
          <p>Portfolio</p>
        </div>

        <div className="footer-col">
          <h3>Contact Details</h3>
          <p>
            leyarsscreative@gmail.com<br/>
            +63 962 284 3247
          </p>
          <p>
            Iponan, Cagayan De Oro<br/>
            9000 Misamis Oriental
          </p>
        </div>

        <div className="footer-col">
          <h3>Contact Us</h3>
          <p>Lorem</p>
          <p>Ispum</p>
          <p>Lorem</p>
          <p>Ispum</p>
        </div>

      </div>

      <div className="footer-line"/>

      <p className="copyright">
        © 2026 Leyarss Creatives. All rights reserved.
      </p>

    </footer>
  )
}