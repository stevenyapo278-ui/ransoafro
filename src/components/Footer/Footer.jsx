import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="footer">
      <div className="footer-inner">
        <div className="footer-center-content">
          {/* [5] Tagline centrée, italic, font-serif, #B8860B/70 */}
          <span className="footer-tagline">Révèle ta vraie nature</span>

          {/* [5] Nav footer — 2 liens max, font-size 11px */}
          <ul className="footer-links">
            <li><a href="#diagnostic">Diagnostic</a></li>
            <li><a href="#contact-session">Contact</a></li>
          </ul>
        </div>

        <div className="footer-bottom">
          <span>© 2025 Rans'O Afro. Rooted in Heritage, Refined by Science.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
