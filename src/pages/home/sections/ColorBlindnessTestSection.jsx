import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/colorBlindnessTestSection.css';

const PLATES = [
  {
    number: "12",
    options: ["12", "8", "6", "None"],
    correctAnswer: "12",
    blindAnswer: "12",
    explanation: "This is a demonstration plate. Everyone with normal or color-deficient vision should see the number 12.",
    type: "demo"
  },
  {
    number: "8",
    options: ["8", "3", "5", "None"],
    correctAnswer: "8",
    blindAnswer: "3",
    explanation: "Individuals with red-green color blindness usually see the number 3, while those with normal vision see 8.",
    type: "red-green"
  },
  {
    number: "6",
    options: ["6", "5", "8", "None"],
    correctAnswer: "6",
    blindAnswer: "5",
    explanation: "Individuals with red-green color blindness usually see the number 5, while those with normal vision see 6.",
    type: "red-green"
  },
  {
    number: "29",
    options: ["29", "70", "21", "None"],
    correctAnswer: "29",
    blindAnswer: "70",
    explanation: "Individuals with red-green color blindness usually see the number 70, while those with normal vision see 29.",
    type: "red-green"
  },
  {
    number: "5",
    options: ["5", "2", "3", "None"],
    correctAnswer: "5",
    blindAnswer: "None",
    explanation: "Individuals with blue-yellow color blindness (tritanopia) usually see nothing or a different pattern, while normal vision sees 5.",
    type: "blue-yellow"
  }
];

function IshiharaPlate({ number, type }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, 300, 300);

    // Create offscreen canvas to render text mask
    const offscreen = document.createElement('canvas');
    offscreen.width = 300;
    offscreen.height = 300;
    const oCtx = offscreen.getContext('2d');
    oCtx.fillStyle = 'black';
    oCtx.font = 'bold 160px Inter, Arial, sans-serif';
    oCtx.textAlign = 'center';
    oCtx.textBaseline = 'middle';
    // Center the number vertically and horizontally
    oCtx.fillText(number, 150, 150);

    const imgData = oCtx.getImageData(0, 0, 300, 300);

    // Palettes
    const palettes = {
      demo: {
        text: ['#f05033', '#e24022', '#f46c52', '#d5361a', '#e8593c'],
        bg: ['#5da054', '#488f3c', '#75b36a', '#549947', '#64a758']
      },
      'red-green': {
        text: ['#f44336', '#e53935', '#d32f2f', '#ff5252', '#ff7373', '#ff6b6b', '#c62828', '#b71c1c'],
        bg: ['#4caf50', '#43a047', '#388e3c', '#66bb6a', '#81c784', '#2e7d32', '#558b2f', '#689f38']
      },
      'blue-yellow': {
        text: ['#3f51b5', '#3949ab', '#303f9f', '#5c6bc0', '#7986cb', '#283593', '#1a237e'],
        bg: ['#ffc107', '#ffb300', '#ffa000', '#ffca28', '#ffd54f', '#ff8f00', '#ff6f00']
      }
    };

    const palette = palettes[type] || palettes['red-green'];

    const dots = [];
    const maxDots = 750;
    const centerX = 150;
    const centerY = 150;
    const maxRadius = 135;

    // Generate packed dots
    for (let i = 0; i < maxDots; i++) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 150) {
        attempts++;
        const angle = Math.random() * Math.PI * 2;
        // Distribute density slightly more towards center
        const r = Math.pow(Math.random(), 0.8) * maxRadius;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        // Calculate maximum allowed radius based on distance to boundary
        const distFromEdge = maxRadius - r;
        const maxR = Math.min(8.5, Math.max(2.2, distFromEdge * 0.25));
        const rad = 2.0 + Math.random() * (maxR - 2.0);

        // Collision detection
        let overlap = false;
        for (const dot of dots) {
          const dx = dot.x - x;
          const dy = dot.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < dot.r + rad + 1.2) {
            overlap = true;
            break;
          }
        }

        if (!overlap) {
          dots.push({ x, y, r: rad });
          placed = true;
        }
      }
    }

    // Render dots
    dots.forEach(dot => {
      const px = Math.round(dot.x);
      const py = Math.round(dot.y);
      const index = (py * 300 + px) * 4;
      const isInside = imgData.data[index + 3] > 100; // Check alpha value of mask

      // Decide color
      let colorList = isInside ? palette.text : palette.bg;

      // Add 2% noise (color swap) to make it look hyper-realistic
      if (Math.random() < 0.02) {
        colorList = isInside ? palette.bg : palette.text;
      }

      const color = colorList[Math.floor(Math.random() * colorList.length)];

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

  }, [number, type]);

  return (
    <div className="plate-canvas-wrapper">
      <canvas
        ref={canvasRef}
        width="300"
        height="300"
        className="plate-canvas"
        aria-label={`Color blindness test plate showing a number`}
      />
    </div>
  );
}

function ColorBlindnessTestSection() {
  const [step, setStep] = useState(0); // 0: Welcome, 1-5: Plates, 6: Results
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleStart = () => {
    setStep(1);
    setAnswers({});
    setResult(null);
  };

  const handleAnswer = (plateIndex, answer) => {
    const updatedAnswers = { ...answers, [plateIndex]: answer };
    setAnswers(updatedAnswers);

    if (step < PLATES.length) {
      setStep(step + 1);
    } else {
      // Calculate Results
      evaluateResults(updatedAnswers);
    }
  };

  const evaluateResults = (finalAnswers) => {
    let redGreenFails = 0;
    let tritanFails = 0;
    let totalCorrect = 0;

    PLATES.forEach((plate, idx) => {
      const userAnswer = finalAnswers[idx + 1];
      if (userAnswer === plate.correctAnswer) {
        totalCorrect++;
      } else {
        if (plate.type === 'red-green') {
          redGreenFails++;
        } else if (plate.type === 'blue-yellow') {
          tritanFails++;
        }
      }
    });

    let diagnostic = "";
    let severity = "normal"; // normal, warning, high

    if (redGreenFails >= 2 && tritanFails >= 1) {
      diagnostic = "Multiple Vision Deficiencies Detected";
      severity = "high";
    } else if (redGreenFails >= 2) {
      diagnostic = "Potential Red-Green Color Blindness (Protanopia/Deuteranopia)";
      severity = "high";
    } else if (tritanFails >= 1) {
      diagnostic = "Potential Blue-Yellow Color Blindness (Tritanopia)";
      severity = "high";
    } else if (redGreenFails === 1) {
      diagnostic = "Mild Red-Green Color Deficiency Detected";
      severity = "warning";
    } else {
      diagnostic = "Normal Color Vision Detected";
      severity = "normal";
    }

    setResult({
      totalCorrect,
      diagnostic,
      severity,
      redGreenFails,
      tritanFails
    });
    setStep(PLATES.length + 1);
  };

  const currentPlate = PLATES[step - 1];

  return (
    <section id="color-blindness-test" className="color-test-section">
      <div className="test-container">
        <div className="test-card">

          {step === 0 && (
            <div className="test-intro">
              <div className="test-badge">Interactive Tool</div>
              <h2>Quick Color Vision Test</h2>
              <p>
                Color blindness affects approximately 1 in 12 men and 1 in 200 women worldwide.
                Take this quick 1-minute interactive Ishihara test to check your color perception.
              </p>
              <div className="intro-visual">
                <div className="fake-plate demo-dot-1"></div>
                <div className="fake-plate demo-dot-2"></div>
                <div className="fake-plate demo-dot-3"></div>
              </div>
              <button className="test-start-btn" onClick={handleStart}>
                Start the Test
              </button>
            </div>
          )}

          {step > 0 && step <= PLATES.length && currentPlate && (
            <div className="test-active">
              <div className="test-progress">
                <div className="progress-text">
                  Plate <span>{step}</span> of {PLATES.length}
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${(step / PLATES.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <h3>What number do you see in the circle below?</h3>

              <div className="plate-view">
                <IshiharaPlate number={currentPlate.number} type={currentPlate.type} />
              </div>

              <div className="options-grid">
                {currentPlate.options.map((option, idx) => (
                  <button
                    key={idx}
                    className="option-btn"
                    onClick={() => handleAnswer(step, option)}
                  >
                    {option === "None" ? "No Number" : option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step > PLATES.length && result && (
            <div className="test-results">
              <div className={`result-indicator ${result.severity}`}>
                {result.severity === 'normal' ? '🟢' : result.severity === 'warning' ? '🟡' : '🔴'}
              </div>
              <h2>Your Results</h2>
              <h3 className={`diagnostic-text ${result.severity}`}>
                {result.diagnostic}
              </h3>

              <div className="score-badge">
                Correct Answers: <strong>{result.totalCorrect} / {PLATES.length}</strong>
              </div>

              <p className="results-description">
                {result.severity === 'normal'
                  ? "Great news! Your answers indicate normal color vision. You can still use Accextension to enhance contrast, readability, and reduce eye strain."
                  : "Based on your selections, you may have some form of color vision deficiency. Don't worry! This is very common, and there are tools to help you."
                }
              </p>

              <div className="results-info-box">
                <h4>How can Accextension help you?</h4>
                <p>
                  Our browser extension features <strong>ColorSense</strong>, a real-time accessibility filter that re-maps colors on any website.
                  It helps individuals with Protanopia, Deuteranopia, Tritanopia, and Achromatopsia distinguish details easily.
                </p>
                <div className="results-cta">
                  <Link to="/#features-section" className="cta-action-btn">
                    Explore ColorSense Feature
                  </Link>
                </div>
              </div>

              <div className="test-footer-buttons">
                <button className="restart-btn" onClick={handleStart}>
                  Retake Test
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

export default ColorBlindnessTestSection;
