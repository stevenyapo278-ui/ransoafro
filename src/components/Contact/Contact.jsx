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
              <span className="cta-icon">💬</span>
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
