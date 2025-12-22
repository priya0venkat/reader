import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import './App.css';

const TREATS = [
  { id: 'apple', emoji: '🍎', name: 'Apple' },
  { id: 'cookie', emoji: '🍪', name: 'Cookie' },
  { id: 'chocolate', emoji: '🍫', name: 'Chocolate' },
  { id: 'strawberry', emoji: '🍓', name: 'Strawberry' },
  { id: 'pizza', emoji: '🍕', name: 'Pizza' },
  { id: 'donut', emoji: '🍩', name: 'Donut' },
  { id: 'icecream', emoji: '🍦', name: 'Ice Cream' },
  { id: 'cake', emoji: '🍰', name: 'Cake' },
];

function App() {
  const [targetNumber, setTargetNumber] = useState(1);
  const [currentCount, setCurrentCount] = useState(0);
  const [currentTreat, setCurrentTreat] = useState(TREATS[0]);
  const [itemsOnPlate, setItemsOnPlate] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const [hasStarted, setHasStarted] = useState(false);
  const [voice, setVoice] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      setVoice(enVoice);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text) => {
    if (!window.speechSynthesis) return;

    // Cancel any previous speech to avoid queue buildup
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;

    utterance.rate = 1.0;
    utterance.pitch = 1.1;

    utterance.onerror = (e) => console.error("Speech Error:", e);

    window.speechSynthesis.speak(utterance);
  };

  const startGame = () => {
    setHasStarted(true);
    speak("Let's go!");
    startNewLevel();
  };

  const startNewLevel = () => {
    const newTarget = Math.floor(Math.random() * 20) + 1;
    const randomTreat = TREATS[Math.floor(Math.random() * TREATS.length)];
    setTargetNumber(newTarget);
    setCurrentTreat(randomTreat);
    setCurrentCount(0);
    setShowSuccess(false);

    // Pre-fill the plate with N items
    const newItems = Array.from({ length: newTarget }, (_, i) => ({
      id: Date.now() + i,
      // Spiral layout pre-calculation
      // Reduced spread 50->35 and font 5rem->4rem for mobile responsiveness
      x: 35 * Math.sqrt(i + 1) * Math.cos(i * 2.39996),
      y: 35 * Math.sqrt(i + 1) * Math.sin(i * 2.39996),
    }));
    setItemsOnPlate(newItems);

    // Announce level
    setTimeout(() => {
      speak(`Count the ${randomTreat.name}s!`);
    }, 500);
  };

  const handleItemClick = (id) => {
    if (showSuccess) return;

    const newCount = currentCount + 1;
    setCurrentCount(newCount);

    // Remove the clicked item
    setItemsOnPlate(prevItems => prevItems.filter(item => item.id !== id));

    playPopSound();
    speak(newCount.toString());

    // Check win condition (all items removed)
    if (newCount === targetNumber) {
      handleWin();
    }
  };

  const handleWin = () => {
    setShowSuccess(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    playSuccessSound();

    setTimeout(() => {
      speak("Great job!");
    }, 1000);

    setTimeout(startNewLevel, 4000);
  };

  const playPopSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.play().catch(e => console.log('Audio play failed', e));
  };

  const playSuccessSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
    audio.play().catch(e => console.log('Audio play failed', e));
  };

  return (
    <div className="game-container">
      <header>
        <a href="/" className="home-btn" style={{ position: 'absolute', top: '20px', left: '20px', textDecoration: 'none', fontSize: '2rem' }}>🏠</a>
        <h1>Count the {currentTreat.name}s!</h1>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(currentCount / targetNumber) * 100}%` }}
          />
        </div>
      </header>

      {!hasStarted && (
        <div className="start-overlay" style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 1000,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>Counting Game</h1>
          <button
            onClick={startGame}
            style={{
              fontSize: '3rem', padding: '1rem 3rem', borderRadius: '50px',
              border: 'none', background: 'var(--secondary)', color: 'white',
              cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
              marginBottom: '2rem'
            }}
          >
            Start Playing ▶️
          </button>
        </div>
      )}

      <main>
        {/* Pantry removed */}

        <div className="plate-area">
          <div className={`plate ${showSuccess ? 'success' : ''}`}>
            <AnimatePresence>
              {itemsOnPlate.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.2, cursor: 'pointer' }}
                  whileTap={{ scale: 0.9 }}
                  className="plate-item"
                  onClick={() => handleItemClick(item.id)}
                  style={{
                    fontSize: '4rem',
                    position: 'absolute',
                    // Use pre-calculated positions or calculate on fly? 
                    // Using stored x/y is better for stability if we were re-ordering, 
                    // but here we just remove. Let's use item properties.
                    left: `calc(50% + ${item.x}px)`,
                    top: `calc(50% + ${item.y}px)`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {currentTreat.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="count-display">{currentCount > 0 ? currentCount : ''}</div>
          </div>
        </div>
      </main>

      {showSuccess && (
        <motion.div
          className="success-message"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 style={{ fontSize: '4rem' }}>Great Job! 🎉</h2>
        </motion.div>
      )}
    </div>
  );
}

export default App;
