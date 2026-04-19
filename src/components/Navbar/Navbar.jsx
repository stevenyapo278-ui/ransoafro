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
    <div className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <nav id="navbar">
        <ul className="nav-left">
          <li><a href="#diagnostic">Diagnostic</a></li>
          <li><a href="#contact-session">Contact</a></li>
        </ul>

        <div className="nav-center">
          <a className="nav-logo" href="#">
            <img src={logo} alt="Rans'o Afro" className="logo-img" />
          </a>
        </div>

        <ul className="nav-right">
          <li>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Changer de thème">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
