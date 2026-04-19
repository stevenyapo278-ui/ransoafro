import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import HairAnimation from './components/HairAnimation/HairAnimation';
import CustomCursor from './components/CustomCursor/CustomCursor';
import DecorativeLayers from './components/DecorativeLayers/DecorativeLayers';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import StorySection from './components/StorySection/StorySection';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import QuizSection from './features/Quiz/QuizSection';
import productVideo from './assets/product-video.webm';
import 'lenis/dist/lenis.css';

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    } else {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  // Smooth Scroll Initialization
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-container">
      {/* Animation 3D en fond global */}
      <HairAnimation theme={theme} />

      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Hero />
        <QuizSection />
      </main>

      <Contact />
      <Footer />
    </div>
  );
}

export default App;
