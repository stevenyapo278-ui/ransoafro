import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import './Quiz.css';
import { quizQuestions } from './quizData';

const TOTAL = quizQuestions.length; // 4

/* ── Animated Step Progress Bar ── */
const StepBar = ({ currentStep }) => {
  return (
    <div className="step-bar" role="progressbar" aria-valuenow={currentStep} aria-valuemax={TOTAL}>
      {quizQuestions.map((_, idx) => {
        const step = idx + 1;
        const isDone = currentStep > step;
        const isActive = currentStep === step;
        return (
          <React.Fragment key={step}>
            <div
              className={`step-circle ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              aria-label={`Étape ${step}${isDone ? ' complétée' : isActive ? ' en cours' : ''}`}
            >
              {isDone ? (
                /* Checkmark SVG animé */
                <svg className="step-check" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className="step-num">{step}</span>
              )}
            </div>
            {step < TOTAL && (
              <div className="step-connector">
                <div className={`step-connector-fill ${isDone ? 'done' : ''}`} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ── Check Icon for selected option ── */
const CheckIcon = () => (
  <svg className="opt-check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" fill="#B8860B" />
    <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const QuizSection = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState(null);
  const sectionRef = useRef(null);
  const questionRef = useRef(null);

  const handleOptionClick = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const animateTransition = (cb) => {
    if (questionRef.current) {
      gsap.to(questionRef.current, {
        opacity: 0,
        x: -24,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          cb();
          gsap.fromTo(
            questionRef.current,
            { opacity: 0, x: 24 },
            { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out', delay: 0.05 }
          );
        },
      });
    } else {
      cb();
    }
  };

  const nextQ = () => {
    if (answers[currentStep]) {
      if (currentStep < TOTAL) {
        animateTransition(() => setCurrentStep(currentStep + 1));
      }
    }
  };

  const showResults = () => {
    if (answers[TOTAL]) {
      const pScore = calculatePorosity(answers);
      animateTransition(() => {
        setResult(pScore);
        setIsFinished(true);
      });
    }
  };

  const calculatePorosity = (ans) => {
    const scores = { A: 1, B: 2, C: 3 };
    let total = 0;
    Object.values(ans).forEach((v) => (total += scores[v]));

    if (total <= 5) return { type: 'Faible', desc: 'Vos écailles sont très serrées.', sol: 'Utilisez de la chaleur douce pour ouvrir les écailles.' };
    if (total <= 9) return { type: 'Moyenne', desc: 'Votre cheveu est équilibré.', sol: 'Maintenez votre routine actuelle avec des produits hydratants.' };
    return { type: 'Haute', desc: 'Vos écailles sont très ouvertes.', sol: "Privilégiez les rinçages à l'eau froide et les huiles scellantes." };
  };

  const currentQuestion = quizQuestions[currentStep - 1];
  const hasAnswer = !!answers[currentStep];

  return (
    <section className="quiz-section" id="diagnostic" ref={sectionRef}>
      <div className="quiz-inner">
        <span className="quiz-label">Le Rituel sur Mesure</span>
        <h2 className="quiz-heading">
          Quel est votre type<br />de <em>porosité</em>&nbsp;?
        </h2>

        <div className="quiz-main-content">
          {/* [3] PROGRESS BAR — 4 cercles numérotés reliés */}
          {!isFinished && <StepBar currentStep={currentStep} />}

          {/* [2] Progress label minimal "1 sur 4" */}
          {!isFinished && (
            <div className="progress-label" aria-live="polite">
              <span className="progress-current">{currentStep}</span>
              <span className="progress-sep"> sur </span>
              <span className="progress-total">{TOTAL}</span>
            </div>
          )}

          {/* QUESTIONS */}
          {!isFinished && currentQuestion && (
            <div key={currentQuestion.id} className="quiz-question active" ref={questionRef}>
              <span className="q-tag">{currentQuestion.tag.split('—')[0].trim()}</span>
              <p className="q-text">{currentQuestion.text}</p>
              <div className="quiz-options">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.val;
                  return (
                    <button
                      key={opt.val}
                      className={`quiz-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleOptionClick(currentQuestion.id, opt.val)}
                      aria-pressed={isSelected}
                    >
                      {/* [2] Pastille A/B/C — fond #3D1A0A, texte blanc, 28px */}
                      <span className="opt-letter" aria-hidden="true">{opt.val}</span>
                      <span className="opt-text">{opt.text}</span>
                      {/* [2] Check icon animé scale 0→1 à la sélection */}
                      {isSelected && <CheckIcon />}
                    </button>
                  );
                })}
              </div>

              {/* [2] Bouton SUIVANT — full-width, sticky bottom, hauteur 56px, bg #3D1A0A */}
              <div className="quiz-next">
                {currentStep < TOTAL ? (
                  <button
                    className={`btn-next ${hasAnswer ? 'on' : ''}`}
                    onClick={nextQ}
                    disabled={!hasAnswer}
                    aria-label="Question suivante"
                  >
                    Suivant
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                ) : (
                  <button
                    className={`btn-next ${answers[TOTAL] ? 'on' : ''}`}
                    onClick={showResults}
                    disabled={!answers[TOTAL]}
                    aria-label="Voir mon résultat"
                  >
                    Voir mon résultat ✦
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RESULTS */}
        {isFinished && result && (
          <div id="quiz-results" className="active">
            <div className="result-card">
              <span className="result-type">Diagnostic Terminé</span>
              <h3 className="result-title">Porosité <em>{result.type}</em></h3>
              <p className="result-state">{result.desc}</p>
              <div className="result-sol-box">
                <span className="result-sol-label">Conseil Expert</span>
                <p className="result-sol">{result.sol}</p>
              </div>
              <div className="result-actions">
                <button className="btn-restart" onClick={() => window.location.reload()}>
                  Recommencer
                </button>
                {/* [4] WhatsApp CTA — border-radius 12px, fond #B8860B, icône + micro-animation */}
                <a href="https://wa.me/2250151912206" className="btn-whatsapp" target="_blank" rel="noopener noreferrer">
                  <span className="whatsapp-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </span>
                  ENVOYER MON RESULTAT SUR WHATSAPP
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
