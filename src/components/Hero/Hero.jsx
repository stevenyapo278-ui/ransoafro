import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroProduct from '../../assets/hero-product.png';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.fromTo('#hl', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .9, delay: .3, ease: 'power3.out' });
      gsap.fromTo('#ht', { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 1.2, delay: .5, ease: 'power3.out' });
      gsap.fromTo('#hs', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.0, delay: .8, ease: 'power3.out' });
      gsap.fromTo('#hc', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .9, delay: 1.0, ease: 'power3.out' });
      gsap.fromTo('#hbi', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.2, delay: 1.2, ease: 'back.out(1.7)' });
      gsap.fromTo('#si', { opacity: 0 },         { opacity: 1, duration: 1, delay: 1.5, ease: 'power3.out' });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-text-glass">
            <span className="hero-label" id="hl">Soin Capillaire Éditorial</span>
            <h1 className="hero-title" id="ht">
              <span className="title-top">Révèle ta</span><br />
              <em className="title-bottom">vraie nature</em>
            </h1>
            <p className="hero-sub" id="hs">
              Des rituels d'exception inspirés par la terre africaine, conçus pour magnifier l'authenticité de vos boucles.
            </p>
            <div className="hero-actions">
              <a className="hero-cta" href="#diagnostic" id="hc">
                Commencer le diagnostic
                <span className="cta-arrow">→</span>
              </a>
              <div className="hero-badge" id="hbi">
                <div className="hero-badge-inner">
                  <span className="hero-badge-num">100%</span>
                  <span className="hero-badge-sub">Naturel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-ind" id="si">
        <div className="scroll-line"></div>
        <span className="scroll-text">Défiler</span>
      </div>
    </section>
  );
};

export default Hero;
