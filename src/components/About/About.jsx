import React from 'react';
import './About.css';

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-inner">
        <div className="reveal">
          <div className="about-text-glass">
            <span className="about-label">Notre Mission</span>
            <h2 className="about-title">Révéler la beauté <em>authentique</em> de chaque couronne</h2>
            <p className="about-body">
              Rans'O Afro est née d'une conviction profonde : chaque cheveu texturé mérite une attention singulière, des soins pensés pour lui.<br /><br />
              Nos formulations puisent dans le patrimoine naturel africain — beurre de karité, huile d'avocat, ricin du terroir — pour offrir à vos boucles exactement ce dont elles ont besoin.
            </p>
          </div>
        </div>
        <div className="about-stats reveal">
          <div className="stat-item">
            <div className="stat-num">100<span className="stat-sup">%</span></div>
            <div className="stat-label">Naturel</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">2</div>
            <div className="stat-label">Gammes expertes</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">2500<span className="stat-sup">+</span></div>
            <div className="stat-label">Clientes satisfaites</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">3</div>
            <div className="stat-label">Profils capillaires</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
