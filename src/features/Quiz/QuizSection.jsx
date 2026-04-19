import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { quizQuestions, resultsData } from './quizData';
import './Quiz.css';

const QuizSection = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const torusMeshRef = useRef(null);
  const shapesRef = useRef([]);

  useEffect(() => {
    // --- THREE.JS QUIZ BACKGROUND ---
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(section.offsetWidth, section.offsetHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, section.offsetWidth / section.offsetHeight, 0.1, 1000);
    camera.position.z = 7;

    const shapes = [
      new THREE.TorusGeometry(3.2, 0.012, 16, 120),
      new THREE.TorusGeometry(2.4, 0.018, 16, 80),
      new THREE.TorusGeometry(3.8, 0.008, 16, 150),
      new THREE.TorusGeometry(2.8, 0.015, 16, 100),
    ];
    shapesRef.current = shapes;

    const torusMat = new THREE.MeshBasicMaterial({ color: 0xC9973A, transparent: true, opacity: 0.18 });
    const torusMesh = new THREE.Mesh(shapes[0], torusMat);
    torusMesh.rotation.x = Math.PI / 3;
    scene.add(torusMesh);
    torusMeshRef.current = torusMesh;

    const torus2 = new THREE.Mesh(new THREE.TorusGeometry(2, 0.007, 16, 80), new THREE.MeshBasicMaterial({ color: 0xE8C27A, transparent: true, opacity: 0.1 }));
    torus2.rotation.x = Math.PI / 4; torus2.rotation.z = Math.PI / 5;
    scene.add(torus2);

    // Quiz particles
    const QN = 70;
    const qGeo = new THREE.BufferGeometry();
    const qPos = new Float32Array(QN * 3);
    const qSpd = [];
    for (let i = 0; i < QN; i++) {
      qPos[i * 3] = (Math.random() - 0.5) * 18; qPos[i * 3 + 1] = (Math.random() - 0.5) * 18; qPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      qSpd.push({ x: (Math.random() - 0.5) * 0.0012, y: (Math.random() - 0.5) * 0.0008 });
    }
    qGeo.setAttribute('position', new THREE.BufferAttribute(qPos, 3));
    const qPts = new THREE.Points(qGeo, new THREE.PointsMaterial({ color: 0xF5E4B8, size: 0.2, transparent: true, opacity: 0.55 }));
    scene.add(qPts);

    let animId;
    const qzLoop = () => {
      animId = requestAnimationFrame(qzLoop);
      const t = Date.now() * 0.001;
      torusMesh.rotation.z = t * 0.12;
      torus2.rotation.y = t * 0.09; torus2.rotation.x += 0.003;
      qPts.rotation.y = t * 0.04; qPts.rotation.x = t * 0.02;

      const qp = qGeo.attributes.position.array;
      for (let i = 0; i < QN; i++) {
        qp[i * 3] += qSpd[i].x; qp[i * 3 + 1] += qSpd[i].y;
        if (Math.abs(qp[i * 3]) > 9) qSpd[i].x *= -1;
        if (Math.abs(qp[i * 3 + 1]) > 9) qSpd[i].y *= -1;
      }
      qGeo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    qzLoop();

    const handleResize = () => {
      renderer.setSize(section.offsetWidth, section.offsetHeight);
      camera.aspect = section.offsetWidth / section.offsetHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const morphTorus = (idx) => {
    if (!torusMeshRef.current) return;
    const nextGeo = shapesRef.current[idx % shapesRef.current.length];
    gsap.to(torusMeshRef.current.rotation, { z: '+=1.8', duration: 0.6, ease: 'power2.inOut' });
    setTimeout(() => {
      torusMeshRef.current.geometry = nextGeo;
    }, 300);
  };

  const handleOptionClick = (questionId, val) => {
    setAnswers(prev => ({ ...prev, [questionId]: val }));
    // trigger 3D feedback or UI bounce if desired
  };

  const nextQ = () => {
    if (!answers[currentStep]) return;
    morphTorus(currentStep);
    setCurrentStep(prev => prev + 1);
  };

  const showResults = () => {
    if (!answers[4]) return;
    morphTorus(4);
    setIsFinished(true);
    setCurrentStep(5);
  };

  const restartQuiz = () => {
    setAnswers({});
    setCurrentStep(1);
    setIsFinished(false);
    morphTorus(0);
  };

  const getResult = () => {
    const cnt = { A: 0, B: 0, C: 0 };
    Object.values(answers).forEach(v => cnt[v]++);
    const dom = Object.keys(cnt).reduce((a, b) => cnt[a] >= cnt[b] ? a : b);
    return resultsData[dom];
  };

  const result = isFinished ? getResult() : null;

  return (
    <section className="quiz-section curtain-wrap" id="diagnostic" ref={sectionRef}>
      <div className="curtain" id="quiz-curtain"></div>
      <canvas id="quiz-canvas" ref={canvasRef}></canvas>
      <div className="quiz-inner">
        <span className="quiz-label">Le Rituel sur Mesure</span>
        <h2 className="quiz-heading">Quel est votre type<br />de <em>porosité</em>&nbsp;?</h2>

        {/* STEP INDICATOR */}
        <div className="step-dots">
          {[1, 2, 3, 4].map(step => (
            <React.Fragment key={step}>
              <div className={`step-dot ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'done' : ''}`}>
                <span>{step}</span>
                <span className="step-label">{quizQuestions[step - 1].tag.split('—')[1].trim()}</span>
              </div>
              {step < 4 && <div className={`step-line ${currentStep > step ? 'done' : ''}`}></div>}
            </React.Fragment>
          ))}
        </div>

        {/* QUESTIONS */}
        {!isFinished && quizQuestions.map((q, idx) => (
          idx + 1 === currentStep && (
            <div key={q.id} className="quiz-question active">
              <span className="q-tag">{q.tag}</span>
              <p className="q-text">{q.text}</p>
              <div className="quiz-options">
                {q.options.map(opt => (
                  <button
                    key={opt.val}
                    className={`quiz-option ${answers[q.id] === opt.val ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(q.id, opt.val)}
                  >
                    <div className="ripple-container"></div>
                    <span className="opt-letter">{opt.val}</span>
                    <span className="opt-text">{opt.text}</span>
                  </button>
                ))}
              </div>
              <div className="quiz-next">
                {currentStep < 4 ? (
                  <button className={`btn-next ${answers[currentStep] ? 'on' : ''}`} onClick={nextQ}>
                    Suivant <span>→</span>
                  </button>
                ) : (
                  <button className={`btn-next ${answers[4] ? 'on' : ''}`} onClick={showResults}>
                    Voir mon résultat ✦
                  </button>
                )}
              </div>
            </div>
          )
        ))}

        {/* RESULTS */}
        {isFinished && result && (
          <div id="quiz-results" className="active">
            <div className="result-card">
              <div className="result-icon-wrap">{result.icon}</div>
              <span className="result-type">Votre profil — Porosité {result.type}</span>
              <h3 className="result-title" dangerouslySetInnerHTML={{ __html: result.title }}></h3>
              <div className="porosity-visual">
                <span className="porosity-bar-label">Niveau d'ouverture des cuticules</span>
                <div className="porosity-track">
                  <div className="porosity-fill" style={{ width: `${result.pct}%`, transition: 'width 1.2s cubic-bezier(.4,0,.2,1)' }}></div>
                </div>
                <div className="porosity-markers">
                  <span className={result.type === 'Faible' ? 'porosity-marker-active' : ''}>Faible</span>
                  <span className={result.type === 'Moyenne' ? 'porosity-marker-active' : ''}>Moyenne</span>
                  <span className={result.type === 'Haute' ? 'porosity-marker-active' : ''}>Haute</span>
                </div>
              </div>
              <p className="result-state">{result.state}</p>
              <span className="result-sol-label">Votre routine sur-mesure</span>
              <p className="result-sol" dangerouslySetInnerHTML={{ __html: result.sol }}></p>
              <div className="result-actions">
                <button className="btn-restart" onClick={restartQuiz}>Recommencer le test</button>
                <a
                  className="btn-whatsapp"
                  href={`https://wa.me/2250151912206?text=${encodeURIComponent(`🌿 *Mon résultat Rans'O Afro*\n\nMon type de porosité est : *${result.type}* ${result.icon}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="whatsapp-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </span>
                  Envoyer par WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuizSection;
