import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger entrance animations — fadeUp depuis y:20
      const stagger = 0.15;
      const items = [
        { el: '#hl', y: 20 },
        { el: '#ht', y: 20 },
        { el: '#hs', y: 20 },
        { el: '.hero-cta-wrap', y: 20 },
        { el: '.hero-badge', y: 20 },
        { el: '#si', y: 0, opacity: true },
      ];

      items.forEach(({ el, y, opacity }, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: y || 0 },
          {
            opacity: 1,
            y: 0,
            duration: opacity ? 1 : 0.9,
            ease: 'power4.out',
            delay: i * stagger,
          }
        );
      });

      // Scroll-linked animations
      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          pin: true,
          pinSpacing: false,
        },
        scale: 0.9,
        opacity: 0,
        y: -100,
        ease: 'none',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      {/* Overlay gradient semi-transparent sur le fond tressé */}
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-inner" ref={contentRef}>
        <div className="hero-content">
          <div className="hero-text-wrap">
            <span className="hero-label" id="hl">Soin Capillaire Éditorial</span>
            <h1 className="hero-title" id="ht" ref={titleRef}>
              <span className="line-1">Révélez votre</span><br />
              <span className="line-2">éclat <em>naturel</em></span>
            </h1>
            <p className="hero-description" id="hs">
              Le premier diagnostic intelligent pour sublimer vos racines et vos boucles. Une expertise haute couture, enfin chez vous.
            </p>

            <div className="hero-actions">
              {/* CTA principal — fond #3D1A0A, texte blanc, flèche animée */}
              <a className="hero-cta hero-cta-wrap" href="#diagnostic" id="hero-cta-btn">
                <span className="cta-text">Commencer le Diagnostic</span>
                <span className="cta-arrow" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </a>

              {/* Badge 100% Naturel */}
              <div className="hero-badge" aria-label="100% Naturel">
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
