import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Quiz.css';
import { quizQuestions } from './quizData';

const QuizSection = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState(null);
  const sectionRef = useRef(null);

  const handleOptionClick = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const nextQ = () => {
    if (answers[currentStep]) {
      if (currentStep < 4) setCurrentStep(currentStep + 1);
    }
  };

  const showResults = () => {
    if (answers[4]) {
      const pScore = calculatePorosity(answers);
      setResult(pScore);
      setIsFinished(true);
    }
  };

  const calculatePorosity = (ans) => {
    const scores = { A: 1, B: 2, C: 3 };
    let total = 0;
    Object.values(ans).forEach(v => total += scores[v]);
    
    if (total <= 5) return { type: 'Faible', desc: 'Vos écailles sont très serrées.', sol: 'Utilisez de la chaleur douce pour ouvrir les écailles.' };
    if (total <= 9) return { type: 'Moyenne', desc: 'Votre cheveu est équilibré.', sol: 'Maintenez votre routine actuelle avec des produits hydratants.' };
    return { type: 'Haute', desc: 'Vos écailles sont très ouvertes.', sol: 'Privilégiez les rinçages à l\'eau froide et les huiles scellantes.' };
  };

  return (
    <section className="quiz-section" id="diagnostic" ref={sectionRef}>
      <div className="quiz-inner">
        <span className="quiz-label">Le Rituel sur Mesure</span>
        <h2 className="quiz-heading">Quel est votre type<br />de <em>porosité</em>&nbsp;?</h2>

        <div className="quiz-main-content">
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
                <button className="btn-restart" onClick={() => window.location.reload()}>Recommencer</button>
                <a href="https://wa.me/2250707070707" className="btn-whatsapp">Consulter un expert WhatsApp</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuizSection;
