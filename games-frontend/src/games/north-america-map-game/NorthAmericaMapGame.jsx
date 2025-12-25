import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import NorthAmericaMap from './components/NorthAmericaMap';
import GameHeader from './components/GameHeader';
import { countriesList } from './data/countries';
import { announceState, playCorrectSound, playWrongSound, playCelebrationSound } from './utils/audio';
import './styles.css';

function NorthAmericaMapGame() {
    const navigate = useNavigate();
    const [gameStarted, setGameStarted] = useState(false);
    const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
    const [correctCountries, setCorrectCountries] = useState([]);
    const [incorrectCountry, setIncorrectCountry] = useState(null);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [shuffledCountries, setShuffledCountries] = useState([]);
    const [gameComplete, setGameComplete] = useState(false);
    const processingRef = useRef(false);

    useEffect(() => {
        if (gameStarted && shuffledCountries.length === 0) {
            let sorted = [...countriesList];
            for (let i = 0; i < sorted.length; i++) {
                const j = Math.min(
                    sorted.length - 1,
                    Math.max(0, i + Math.floor(Math.random() * 5) - 2)
                );
                [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
            }
            setShuffledCountries(sorted);
        }
    }, [gameStarted, shuffledCountries.length]);

    useEffect(() => {
        if (gameStarted && shuffledCountries.length > 0 && currentCountryIndex < shuffledCountries.length) {
            setTimeout(() => {
                announceState(shuffledCountries[currentCountryIndex]);
            }, 500);
        }
    }, [currentCountryIndex, gameStarted, shuffledCountries]);

    const handleStartGame = () => {
        setGameStarted(true);
        setCurrentCountryIndex(0);
        setCorrectCountries([]);
        setScore(0);
        setAttempts(0);
        setGameComplete(false);
        setShuffledCountries([]);
        processingRef.current = false;
    };

    const handleCountryClick = (clickedCountry) => {
        if (!gameStarted || gameComplete) return;
        if (processingRef.current) return;

        const targetCountry = shuffledCountries[currentCountryIndex];
        setAttempts(prev => prev + 1);

        if (clickedCountry === targetCountry) {
            playCorrectSound();
            setCorrectCountries(prev => [...prev, clickedCountry]);
            setScore(prev => prev + 1);
            setIncorrectCountry(null);
            processingRef.current = true;

            setTimeout(() => {
                if (currentCountryIndex + 1 < shuffledCountries.length) {
                    setCurrentCountryIndex(prev => prev + 1);
                } else {
                    setGameComplete(true);
                    playCelebrationSound();
                    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                }
                processingRef.current = false;
            }, 1500);
        } else {
            playWrongSound();
            setIncorrectCountry(clickedCountry);
            setTimeout(() => setIncorrectCountry(null), 600);
        }
    };

    const handlePlayAgain = () => handleStartGame();

    if (!gameStarted) {
        return (
            <div className="app">
                <button onClick={() => navigate('/')} className="home-btn" style={{
                    position: 'absolute', top: '20px', left: '20px', fontSize: '2rem',
                    background: 'none', border: 'none', cursor: 'pointer', zIndex: 100
                }}>🏠</button>
                <div className="welcome-screen">
                    <h1 className="game-title">
                        <span className="title-icon">🗺️</span>
                        North America Game
                        <span className="title-icon">🌎</span>
                    </h1>
                    <p className="game-description">
                        Test your knowledge of North American geography! Click on the correct country when you hear its name.
                    </p>
                    <div className="features-list">
                        <div className="feature-item"><span className="feature-icon">🔊</span><span>Audio announcements</span></div>
                        <div className="feature-item"><span className="feature-icon">✨</span><span>Interactive map</span></div>
                        <div className="feature-item"><span className="feature-icon">🎯</span><span>Track your score</span></div>
                    </div>
                    <button className="start-button" onClick={handleStartGame}>Start Game</button>
                </div>
            </div>
        );
    }

    if (gameComplete) {
        const accuracy = Math.round((score / attempts) * 100);
        return (
            <div className="app">
                <button onClick={() => navigate('/')} className="home-btn" style={{
                    position: 'absolute', top: '20px', left: '20px', fontSize: '2rem',
                    background: 'none', border: 'none', cursor: 'pointer', zIndex: 100
                }}>🏠</button>
                <div className="complete-screen">
                    <h1 className="complete-title">🎉 Game Complete! 🎉</h1>
                    <div className="final-stats">
                        <div className="final-stat"><div className="final-stat-value">{score}</div><div className="final-stat-label">Correct Answers</div></div>
                        <div className="final-stat"><div className="final-stat-value">{attempts}</div><div className="final-stat-label">Total Attempts</div></div>
                        <div className="final-stat"><div className="final-stat-value">{accuracy}%</div><div className="final-stat-label">Accuracy</div></div>
                    </div>
                    <p className="complete-message">
                        {accuracy === 100 ? "Perfect score! You're a geography master! 🌟" :
                            accuracy >= 80 ? "Great job! You know your geography well! 👏" :
                                accuracy >= 60 ? "Good effort! Keep practicing! 💪" : "Nice try! Practice makes perfect! 📚"}
                    </p>
                    <button className="play-again-button" onClick={handlePlayAgain}>Play Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <button onClick={() => navigate('/')} className="home-btn" style={{
                position: 'absolute', top: '20px', left: '20px', fontSize: '2rem',
                background: 'none', border: 'none', cursor: 'pointer', zIndex: 100
            }}>🏠</button>
            <GameHeader
                targetState={shuffledCountries[currentCountryIndex]}
                score={score}
                totalStates={countriesList.length}
                attempts={attempts}
            />
            <NorthAmericaMap
                targetState={shuffledCountries[currentCountryIndex]}
                onStateClick={handleCountryClick}
                correctStates={correctCountries}
                incorrectState={incorrectCountry}
            />
            <div className="progress-container">
                <div className="progress-text">Country {currentCountryIndex + 1} of {shuffledCountries.length}</div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${((currentCountryIndex + 1) / shuffledCountries.length) * 100}%` }} />
                </div>
            </div>
        </div>
    );
}

export default NorthAmericaMapGame;
