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
      // Entrance animations
      const tl = gsap.timeline();
      
      tl.fromTo('#hl', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power4.out' })
        .fromTo('#ht', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }, '-=0.8')
        .fromTo('#hs', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power4.out' }, '-=1')
        .fromTo('.hero-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .fromTo('#si', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.2');

      // Scroll-linked animations
      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: true,
          pinSpacing: false
        },
        scale: 0.9,
        opacity: 0,
        y: -100,
        ease: "none"
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
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
              <a className="hero-cta" href="#diagnostic">
                Commencer le diagnostic
                <span className="cta-arrow">→</span>
              </a>
              <div className="hero-badge">
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
