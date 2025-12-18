import { useState, useEffect } from 'react';
import WorldMap from './components/WorldMap';
import GameHeader from './components/GameHeader';
import { continentData } from './data/continents';
import { announceTarget, playCorrectSound, playWrongSound, playCelebrationSound } from './utils/audio';
import './App.css';

function App() {
  const [targetCode, setTargetCode] = useState(null);
  const [remainingCodes, setRemainingCodes] = useState([]);
  const [correctNames, setCorrectNames] = useState([]);
  const [incorrectName, setIncorrectName] = useState(null);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (targetCode && !gameComplete) {
      const targetName = continentData[targetCode].name;
      const timer = setTimeout(() => announceTarget(targetName), 500);
      return () => clearTimeout(timer);
    }
  }, [targetCode, gameComplete]);

  const startNewGame = () => {
    const codes = Object.keys(continentData);
    // Fisher-Yates shuffle
    for (let i = codes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [codes[i], codes[j]] = [codes[j], codes[i]];
    }

    setRemainingCodes(codes.slice(1));
    setTargetCode(codes[0]);
    setCorrectNames([]);
    setIncorrectName(null);
    setScore(0);
    setGameComplete(false);
  };

  const handleContinentClick = (clickedName) => {
    if (gameComplete) return;

    const targetName = continentData[targetCode].name;

    if (clickedName === targetName) {
      // Correct!
      setCorrectNames([...correctNames, clickedName]);
      setIncorrectName(null);
      setScore(score + 1);
      playCorrectSound();

      if (remainingCodes.length === 0) {
        setGameComplete(true);
        setTargetCode(null);
        setTimeout(playCelebrationSound, 1000);
      } else {
        const nextCode = remainingCodes[0];
        setRemainingCodes(remainingCodes.slice(1));
        setTargetCode(nextCode);
      }
    } else {
      // Incorrect
      setIncorrectName(clickedName);
      playWrongSound();
      // Reset incorrect name after animation (optional, but good for reactiveness)
      setTimeout(() => setIncorrectName(null), 500);
    }
  };

  return (
    <div className="app-container">
      <GameHeader
        targetContinent={targetCode ? continentData[targetCode].name : ''}
        score={score}
        total={Object.keys(continentData).length}
        isComplete={gameComplete}
        onReset={startNewGame}
      />
      {!gameComplete && (
        <WorldMap
          targetContinent={targetCode ? continentData[targetCode].name : null}
          onContinentClick={handleContinentClick}
          correctContinents={correctNames}
          incorrectContinent={incorrectName}
        />
      )}
    </div>
  );
}

export default App;
