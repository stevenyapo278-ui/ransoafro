import React, { useState, useEffect } from 'react';
import HairAnimation from './components/HairAnimation/HairAnimation';
import CustomCursor from './components/CustomCursor/CustomCursor';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import QuizSection from './features/Quiz/QuizSection';
import quizDeco from './assets/quiz-deco.png';
import productVideo from './assets/product-video.webm';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optional: stop observing once revealed
          // observer.unobserve(entry.target);
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

      <CustomCursor />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Hero />


        <div className="quiz-deco-wrap reveal">
          <video className="quiz-video-deco" autoPlay muted loop playsInline>
            <source src={productVideo} type="video/webm" />
          </video>
        </div>

        <QuizSection />
      </main>

      <Contact />
      <Footer />
    </div>
  );
}

export default App;
