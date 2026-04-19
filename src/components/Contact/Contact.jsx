import React from 'react';
import './Contact.css';

const Contact = () => {
  const whatsappNumber = "+2250151912206";
  const whatsappMessage = encodeURIComponent("Bonjour Rans'O Afro, j'aimerais en savoir plus sur vos produits.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section id="contact-session" className="contact-section reveal">
      <div className="contact-container">
        <div className="contact-glass">
          <div className="contact-content">
            <h2 className="contact-title">Une expertise sur-mesure</h2>
            <p className="contact-description">
              Besoin de conseils personnalisés pour vos cheveux ? Nos experts sont à votre écoute pour vous accompagner dans votre routine capillaire.
            </p>
            
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-cta">
              <span className="cta-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </span>
              <div className="cta-text">
                <span className="cta-action">Discutez avec nous</span>
                <span className="cta-platform">sur WhatsApp</span>
              </div>
              <div className="cta-arrow">→</div>
            </a>
          </div>
          
          <div className="contact-decor">
            <div className="decor-circle circle-1"></div>
            <div className="decor-circle circle-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
