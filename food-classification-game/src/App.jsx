import React, { useState, useEffect } from 'react';
import { foods as initialFoods } from './data/foods';
import FoodCard from './components/FoodCard';
import CategoryButtons from './components/CategoryButtons';
import Feedback from './components/Feedback';
import { playCorrectSound, playWrongSound, playCelebrationSound, announceFoodItem } from './utils/audio';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

function App() {
  const [foods, setFoods] = useState([]);
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize game with shuffled foods
  useEffect(() => {
    setFoods(shuffleArray(initialFoods));
    setGameStarted(true);
  }, []);

  // Announce the food item when it changes
  useEffect(() => {
    if (gameStarted && !gameOver && !showFeedback && foods.length > 0) {
      const currentFood = foods[currentFoodIndex];
      announceFoodItem(currentFood.name);
    }
  }, [currentFoodIndex, gameOver, showFeedback, gameStarted, foods]);

  const handleCategoryClick = (category) => {
    if (showFeedback) return;

    const currentFood = foods[currentFoodIndex];
    const correct = currentFood.category === category;

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
      playCorrectSound();

      // Only advance to next food if answer is correct
      setTimeout(() => {
        setShowFeedback(false);
        if (currentFoodIndex < foods.length - 1) {
          setCurrentFoodIndex(currentFoodIndex + 1);
        } else {
          setGameOver(true);
          playCelebrationSound();
        }
      }, 2000);
    } else {
      playWrongSound();

      // Stay on same food if answer is wrong, just hide feedback after delay
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  };

  const restartGame = () => {
    setFoods(shuffleArray(initialFoods));
    setCurrentFoodIndex(0);
    setScore(0);
    setGameOver(false);
    setShowFeedback(false);
  };

  if (!gameStarted || foods.length === 0) {
    return <div className="app-container">Loading...</div>;
  }

  if (gameOver) {
    return (
      <div className="game-over-screen">
        <h1>Great Job! 🎉</h1>
        <p>You scored {score} out of {foods.length}!</p>
        <button className="restart-btn" onClick={restartGame}>Play Again</button>
      </div>
    );
  }

  const currentFood = foods[currentFoodIndex];

  return (
    <div className="app-container">
      <header className="game-header">
        <h1>Food Classifier</h1>
        <div className="score-board">Score: {score}</div>
      </header>

      <main className="game-area">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${((currentFoodIndex) / foods.length) * 100}%` }}></div>
        </div>

        <FoodCard food={currentFood} />

        {showFeedback ? (
          <Feedback isCorrect={isCorrect} />
        ) : (
          <CategoryButtons onCategoryClick={handleCategoryClick} />
        )}
      </main>
    </div>
  );
}

export default App;
