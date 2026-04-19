import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './DecorativeLayers.css';

gsap.registerPlugin(ScrollTrigger);

const DecorativeLayers = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray('.deco-layer');
      
      layers.forEach((layer, i) => {
        const speed = (i + 1) * 0.2;
        gsap.to(layer, {
          scrollTrigger: {
            trigger: 'body',
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
          y: (i % 2 === 0 ? -1 : 1) * 300 * speed,
          rotation: i * 45,
          ease: "none"
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="decorative-layers" ref={containerRef}>
      <div className="deco-layer deco-circle-1" />
      <div className="deco-layer deco-circle-2" />
      <div className="deco-layer deco-blur-1" />
      <div className="deco-layer deco-blur-2" />
    </div>
  );
};

export default DecorativeLayers;
