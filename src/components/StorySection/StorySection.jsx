import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './StorySection.css';

gsap.registerPlugin(ScrollTrigger);

const StorySection = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal the main title with a "brush" effect
      gsap.fromTo('.story-title', 
        { clipPath: 'inset(100% 0% 0% 0%)', y: 50 },
        { 
          clipPath: 'inset(0% 0% 0% 0%)', 
          y: 0, 
          duration: 1.5, 
          scrollTrigger: {
            trigger: '.story-title',
            start: "top 80%",
            end: "top 20%",
            scrub: 0.5
          }
        }
      );

      // Parallax for the images
      gsap.to('.story-image-container', {
        y: -100,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Staggered reveal for bullets
      gsap.from('.story-item', {
        opacity: 0,
        x: -30,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.story-list',
          start: "top 70%",
          end: "top 40%",
          scrub: true
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="story-section" ref={sectionRef}>
      <div className="story-container">
        <div className="story-header">
          <span className="story-label">L'Héritage</span>
          <h2 className="story-title">Une alchimie entre<br/>tradition et science</h2>
        </div>

        <div className="story-content-wrap">
          <div className="story-text" ref={textRef}>
            <p className="story-desc">
              Chaque goutte de nos élixirs raconte une histoire. Celle des femmes qui, depuis des millénaires, 
              utilisent les richesses de la flore africaine pour protéger leur couronne.
            </p>
            <ul className="story-list">
              <li className="story-item">
                <span className="item-num">01</span>
                <div>
                  <h4>Sélection Ethique</h4>
                  <p>Sourcé directement auprès de coopératives locales en Afrique de l'Ouest.</p>
                </div>
              </li>
              <li className="story-item">
                <span className="item-num">02</span>
                <div>
                  <h4>Pureté Totale</h4>
                  <p>Sans sulfates, sans silicones, uniquement le meilleur de la nature.</p>
                </div>
              </li>
              <li className="story-item">
                <span className="item-num">03</span>
                <div>
                  <h4>Efficacité Prouvée</h4>
                  <p>Formulé pour répondre aux besoins spécifiques des cheveux crépus et bouclés.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
