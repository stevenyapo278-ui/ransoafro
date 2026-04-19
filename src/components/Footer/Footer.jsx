import React from 'react';
import './Footer.css';
import logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <footer id="footer">
      <div className="footer-inner">
        <div className="footer-center-content">
          <div className="footer-logo-container">
            <img src={logo} alt="Rans'O Afro" className="footer-logo-img" />
          </div>
          <span className="footer-tagline">Révèle ta vraie nature</span>
          
          <ul className="footer-links">
            <li><a href="#diagnostic">Diagnostic</a></li>
            <li><a href="#contact-session">Contact</a></li>
          </ul>
        </div>

        <div className="footer-bottom">
          <span>© 2025 Rans'O Afro. Rooted in Heritage, Refined by Science.</span>
          <a className="footer-insta" href="#">
            <span className="insta-icon">📷</span>@ransafro
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
