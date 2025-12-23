import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import USMap from './components/USMap';
import GameHeader from './components/GameHeader';
import { statesList } from './data/states';
import { announceState, playCorrectSound, playWrongSound, playCelebrationSound } from './utils/audio';
import './App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [correctStates, setCorrectStates] = useState([]);
  const [incorrectState, setIncorrectState] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [shuffledStates, setShuffledStates] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const processingRef = useRef(false);

  // Use states in area order (largest to smallest)
  useEffect(() => {
    if (gameStarted && shuffledStates.length === 0) {
      // Create a shallow copy to sort and shuffle
      let sorted = [...statesList];

      // Add local randomness: swap elements within a small window (e.g., +/- 3 positions)
      // This keeps the general "large to small" trend but isn't strictly deterministic
      for (let i = 0; i < sorted.length; i++) {
        const j = Math.min(
          sorted.length - 1,
          Math.max(0, i + Math.floor(Math.random() * 7) - 3)
        );
        [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
      }

      setShuffledStates(sorted);
    }
  }, [gameStarted, shuffledStates.length]);

  // Announce state when it changes
  useEffect(() => {
    if (gameStarted && shuffledStates.length > 0 && currentStateIndex < shuffledStates.length) {
      // Small delay before announcing to ensure smooth transition
      setTimeout(() => {
        announceState(shuffledStates[currentStateIndex]);
      }, 500);
    }
  }, [currentStateIndex, gameStarted, shuffledStates]);

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentStateIndex(0);
    setCorrectStates([]);
    setScore(0);
    setAttempts(0);
    setGameComplete(false);
    setShuffledStates([]);
    processingRef.current = false;
  };

  const handleStateClick = (clickedState) => {
    if (!gameStarted || gameComplete) return;

    // Prevent double clicks while transitioning
    if (processingRef.current) return;

    const targetState = shuffledStates[currentStateIndex];
    setAttempts(prev => prev + 1);

    if (clickedState === targetState) {
      // Correct answer
      playCorrectSound();
      setCorrectStates(prev => [...prev, clickedState]);
      setScore(prev => prev + 1);
      setIncorrectState(null);

      // Lock interactions
      processingRef.current = true;

      // Move to next state after a delay
      setTimeout(() => {
        if (currentStateIndex + 1 < shuffledStates.length) {
          setCurrentStateIndex(prev => prev + 1);
        } else {
          // Game complete!
          setGameComplete(true);
          playCelebrationSound();
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
        // Unlock interactions
        processingRef.current = false;
      }, 1500);
    } else {
      // Wrong answer
      playWrongSound();
      setIncorrectState(clickedState);

      // Clear incorrect state highlight after animation
      setTimeout(() => {
        setIncorrectState(null);
      }, 600);
    }
  };

  const handlePlayAgain = () => {
    handleStartGame();
  };

  if (!gameStarted) {
    return (
      <div className="app">
        <div className="welcome-screen">
          <h1 className="game-title">
            <span className="title-icon">🗺️</span>
            US States Game
            <span className="title-icon">🇺🇸</span>
          </h1>
          <p className="game-description">
            Test your knowledge of US geography! Click on the correct state when you hear its name.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🔊</span>
              <span>Audio announcements</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <span>Interactive map</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <span>Track your score</span>
            </div>
          </div>
          <button className="start-button" onClick={handleStartGame}>
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    const accuracy = Math.round((score / attempts) * 100);

    return (
      <div className="app">
        <div className="complete-screen">
          <h1 className="complete-title">🎉 Game Complete! 🎉</h1>
          <div className="final-stats">
            <div className="final-stat">
              <div className="final-stat-value">{score}</div>
              <div className="final-stat-label">Correct Answers</div>
            </div>
            <div className="final-stat">
              <div className="final-stat-value">{attempts}</div>
              <div className="final-stat-label">Total Attempts</div>
            </div>
            <div className="final-stat">
              <div className="final-stat-value">{accuracy}%</div>
              <div className="final-stat-label">Accuracy</div>
            </div>
          </div>
          <p className="complete-message">
            {accuracy === 100
              ? "Perfect score! You're a geography master! 🌟"
              : accuracy >= 80
                ? "Great job! You know your states well! 👏"
                : accuracy >= 60
                  ? "Good effort! Keep practicing! 💪"
                  : "Nice try! Practice makes perfect! 📚"}
          </p>
          <button className="play-again-button" onClick={handlePlayAgain}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <GameHeader
        targetState={shuffledStates[currentStateIndex]}
        score={score}
        totalStates={statesList.length}
        attempts={attempts}
      />
      <USMap
        targetState={shuffledStates[currentStateIndex]}
        onStateClick={handleStateClick}
        correctStates={correctStates}
        incorrectState={incorrectState}
      />
      <div className="progress-container">
        <div className="progress-text">
          State {currentStateIndex + 1} of {shuffledStates.length}
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentStateIndex + 1) / shuffledStates.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
