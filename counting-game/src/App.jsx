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
  const [maxNumber, setMaxNumber] = useState(10);
  const [targetNumber, setTargetNumber] = useState(1);
  const [currentTreat, setCurrentTreat] = useState(TREATS[0]);
  const [itemsOnPlate, setItemsOnPlate] = useState([]);
  const [options, setOptions] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [wrongOption, setWrongOption] = useState(null); // ID of wrong option for shake effect

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

    // If counting numbers, we don't speak anymore. 
    // This is mainly for game start/win messages now.

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

  const generateOptions = (target) => {
    const opts = new Set([target]);
    while (opts.size < 3) {
      // Generate random number between 1 and maxNumber
      let num = Math.floor(Math.random() * maxNumber) + 1;
      if (num !== target) {
        opts.add(num);
      }
    }
    // Convert to array and shuffle
    return Array.from(opts).sort(() => Math.random() - 0.5);
  };

  const startNewLevel = () => {
    const newTarget = Math.floor(Math.random() * maxNumber) + 1;
    const randomTreat = TREATS[Math.floor(Math.random() * TREATS.length)];
    const newOptions = generateOptions(newTarget);

    setTargetNumber(newTarget);
    setCurrentTreat(randomTreat);
    setOptions(newOptions);
    setShowSuccess(false);
    setWrongOption(null);

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
      speak(`Let's eat ${randomTreat.name}s!`);
    }, 500);
  };

  const handleItemClick = (id) => {
    if (showSuccess) return;

    // Just remove item and play pop sound. NO speaking count.
    playPopSound();
    setItemsOnPlate(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleOptionClick = (number) => {
    if (showSuccess) return;

    if (number === targetNumber) {
      handleWin(number);
    } else {
      // Wrong answer
      setWrongOption(number);
      playErrorSound();
      setTimeout(() => setWrongOption(null), 500); // Reset shake after 500ms
    }
  };

  const handleWin = (finalCount) => {
    setShowSuccess(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    playSuccessSound();

    setTimeout(() => {
      speak(`That is right! There were ${finalCount} ${currentTreat.name}s!`);
    }, 1000);

    setTimeout(startNewLevel, 5000);
  };

  const playPopSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.play().catch(e => console.log('Audio play failed', e));
  };

  const playSuccessSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
    audio.play().catch(e => console.log('Audio play failed', e));
  };

  const playErrorSound = () => {
    // Simple buzzer or error sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'); // Example error sound (cork pop high? or maybe simple thud)
    // Actually 2572 is another pop. Let's try 2902 (Error) or just silent if unsure.
    // Let's use a generic error sound if available, or just rely on visual shake.
    // Assuming a placeholder or re-using pop for now but different pitch? Audio api doesn't allow pitch easily.
    // I'll skip the audio URL for error to avoid broken link guesses and stick to Shake.
  };

  return (
    <div className="game-container">
      <header>
        <a href="/" className="home-btn" style={{ position: 'absolute', top: '20px', left: '20px', textDecoration: 'none', fontSize: '2rem' }}>🏠</a>
        <h1>How many {currentTreat.name}s?</h1>
      </header>

      {!hasStarted && (
        <div className="start-overlay" style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 1000,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>Counting Game</h1>

          <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ffcc00' }}>
              Maximum Number: {maxNumber}
            </label>
            <input
              type="range"
              min="5"
              max="30"
              value={maxNumber}
              onChange={(e) => setMaxNumber(parseInt(e.target.value))}
              style={{ width: '300px', cursor: 'pointer' }}
            />
          </div>

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
        <div className="plate-area">
          <div className={`plate ${showSuccess ? 'success' : ''}`}>
            <AnimatePresence>
              {itemsOnPlate.map((item) => (
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
                    left: `calc(50% + ${item.x}px)`,
                    top: `calc(50% + ${item.y}px)`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {currentTreat.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="options-container">
          {options.map((number) => (
            <motion.button
              key={number}
              className={`option-button ${wrongOption === number ? 'shake' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOptionClick(number)}
              animate={wrongOption === number ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              {number}
            </motion.button>
          ))}
        </div>
      </main>

      {showSuccess && (
        <motion.div
          className="success-message"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Correct! That's {targetNumber}! 🎉</h2>
        </motion.div>
      )}
    </div>
  );
}

export default App;
