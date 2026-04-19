import React, { useEffect, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  
  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    
    let mx = 0, my = 0;
    let rx = 0, ry = 0;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursor) {
        cursor.style.left = `${mx}px`;
        cursor.style.top = `${my}px`;
      }
    };

    const tick = () => {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      if (ring) {
        ring.style.left = `${rx}px`;
        ring.style.top = `${ry}px`;
      }
      requestAnimationFrame(tick);
    };

    const onMouseEnter = () => {
      cursor?.classList.add('big');
      ring?.classList.add('big');
    };

    const onMouseLeave = () => {
      cursor?.classList.remove('big');
      ring?.classList.remove('big');
    };

    window.addEventListener('mousemove', onMouseMove);
    const tickId = requestAnimationFrame(tick);

    // Initial check for interactive elements
    const updateListeners = () => {
        const elements = document.querySelectorAll('a, button, .quiz-option');
        elements.forEach(el => {
            el.addEventListener('mouseenter', onMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        });
    };

    updateListeners();
    const observer = new MutationObserver(updateListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(tickId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" id="cursor"></div>
      <div ref={ringRef} className="cursor-ring" id="cursor-ring"></div>
    </>
  );
};

export default CustomCursor;
