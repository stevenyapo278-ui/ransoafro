import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';

const Navbar = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
        <nav id="navbar">
          <ul className="nav-left">
            <li><a href="#diagnostic">Diagnostic</a></li>
          </ul>

          <div className="nav-center">
            <a className="nav-logo" href="#">
              <img src={logo} alt="Rans'o Afro" className="logo-img" />
            </a>
          </div>

          <ul className="nav-right">
            <li><a href="#contact-session">Contact</a></li>
          </ul>
        </nav>
      </div>

      <button className="theme-toggle-fab" onClick={toggleTheme} aria-label="Changer de thème">
        <span className="fab-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
        <span className="fab-text">{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>
    </>
  );
};

export default Navbar;
