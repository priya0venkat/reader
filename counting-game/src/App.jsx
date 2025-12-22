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

  useEffect(() => {
    startNewLevel();
  }, []);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startNewLevel = () => {
    const newTarget = Math.floor(Math.random() * 10) + 1;
    const randomTreat = TREATS[Math.floor(Math.random() * TREATS.length)];
    setTargetNumber(newTarget);
    setCurrentTreat(randomTreat);
    setItemsOnPlate([]);
    setCurrentCount(0);
    setShowSuccess(false);

    // Announce level
    setTimeout(() => {
      speak(`Let's count to ${newTarget}!`);
    }, 500);
  };

  const addItemToPlate = () => {
    if (currentCount < targetNumber) {
      const newItem = {
        id: Date.now(),
        x: Math.random() * 200 - 100, // Random position offset
        y: Math.random() * 200 - 100,
      };
      setItemsOnPlate([...itemsOnPlate, newItem]);
      setItemsOnPlate([...itemsOnPlate, newItem]);

      const newCount = currentCount + 1;
      setCurrentCount(newCount);

      playPopSound();
      speak(newCount.toString());

      checkWin(newCount);
    }
  };

  const checkWin = (count) => {
    if (count === targetNumber) {
      setShowSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      playSuccessSound();
      speak("Great job!");
      setTimeout(startNewLevel, 4000);
    }
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
        <h1>Let's Count to {targetNumber}!</h1>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(currentCount / targetNumber) * 100}%` }}
          />
        </div>
      </header>

      <main>
        <div className="pantry">
          <h2>Pantry</h2>
          <p>Click to add {currentTreat.name}s!</p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="treat-button"
            onClick={addItemToPlate}
            disabled={showSuccess}
          >
            {currentTreat.emoji}
          </motion.button>
        </div>

        <div className="plate-area">
          <div className={`plate ${showSuccess ? 'success' : ''}`}>
            <AnimatePresence>
              {itemsOnPlate.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="plate-item"
                  style={{
                    fontSize: '3rem',
                    position: 'absolute',
                    // Distribute in a spiral or grid if possible, or random
                    // For now, let's just use flex wrapping or absolute randoms
                    left: `calc(50% + ${Math.cos(index) * (index * 15)}px)`,
                    top: `calc(50% + ${Math.sin(index) * (index * 15)}px)`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {currentTreat.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="count-display">{currentCount}</div>
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
