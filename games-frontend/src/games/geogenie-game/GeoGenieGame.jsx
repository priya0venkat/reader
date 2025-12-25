// GeoGenie Game - Main Container Component
// AI-powered geography tutor with 4 adaptive levels

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import GeoGenieAvatar from './components/GeoGenieAvatar';
import SolarSystemLevel from './levels/SolarSystemLevel';
import WorldMapLevel from './levels/WorldMapLevel';
import NorthAmericaLevel from './levels/NorthAmericaLevel';
import USStatesLevel from './levels/USStatesLevel';
import {
    initGeoGenie,
    handleCorrectAnswer,
    handleIncorrectAnswer,
    announceTarget,
    announceLevelComplete,
    startTurn,
    unlockAudio,
    resetSession
} from './geoGenieApi';
import './GeoGenieGame.css';

// Level definitions
// Levels limited to those with embedded data
const LEVELS = [
    { id: 'solar-system', name: 'Space Explorer', emoji: '🚀', description: 'Find the planets!' },
    { id: 'world-map', name: 'World Traveler', emoji: '🌍', description: 'Explore the continents!' },
    { id: 'north-america', name: 'America Explorer', emoji: '🦅', description: 'Explore North America!' },
    { id: 'us-states', name: 'State Master', emoji: '🇺🇸', description: 'Learn the US States!' }
];

function GeoGenieGame() {
    const navigate = useNavigate();

    // Game state
    const [gamePhase, setGamePhase] = useState('welcome'); // 'welcome', 'playing', 'levelComplete', 'gameComplete'
    const [gameMode, setGameMode] = useState(null); // 'train' or 'quiz'
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);

    // Avatar state
    const [avatarState, setAvatarState] = useState('idle');

    // Initialize state
    const [initStatus, setInitStatus] = useState('Loading...');
    const [isReady, setIsReady] = useState(false);

    // Highlighted target for rescue mode
    const [highlightedTarget, setHighlightedTarget] = useState(null);

    // Initialize GeoGenie
    useEffect(() => {
        initGeoGenie(setInitStatus).then(result => {
            setIsReady(result.ready);
        });
    }, []);

    // Get current level config
    const currentLevel = LEVELS[currentLevelIndex];

    // Handle game start with mode
    const handleStartGame = (mode) => {
        unlockAudio();
        resetSession();
        setGameMode(mode);
        setGamePhase('playing');
        setScore(0);
        setTotalAttempts(0);
        setCurrentLevelIndex(0);
    };

    // Handle correct answer from level
    const handleCorrect = useCallback(async (entityName) => {
        setHighlightedTarget(null);
        setAvatarState('celebrating');

        // Only track score in quiz mode
        if (gameMode === 'quiz') {
            setScore(s => s + 1);
            setTotalAttempts(t => t + 1);
        }

        await handleCorrectAnswer(entityName, currentLevel.id, gameMode);

        // Confetti!
        confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 }
        });

        setTimeout(() => setAvatarState('idle'), 2000);
    }, [currentLevel, gameMode]);

    // Handle incorrect answer from level
    const handleIncorrect = useCallback(async (targetEntity, clickedEntity) => {
        setAvatarState('thinking');
        setTotalAttempts(t => t + 1);

        setTimeout(() => setAvatarState('speaking'), 500);

        const result = await handleIncorrectAnswer(targetEntity, clickedEntity, currentLevel.id);

        // Handle rescue mode highlighting
        if (result.isRescue && result.visualCommand?.action === 'highlight') {
            setHighlightedTarget(result.visualCommand.target);
        }

        setTimeout(() => setAvatarState('idle'), 2000);
    }, [currentLevel]);

    // Handle turn start (new target)
    const handleNewTarget = useCallback(async (targetEntity) => {
        startTurn(targetEntity, currentLevel.id);
        setAvatarState('speaking');
        await announceTarget(targetEntity, currentLevel.id, gameMode);
        setTimeout(() => setAvatarState('idle'), 1000);
    }, [currentLevel, gameMode]);

    // Handle level completion
    const handleLevelComplete = useCallback(async () => {
        setGamePhase('levelComplete');
        setAvatarState('celebrating');

        await announceLevelComplete(currentLevel.id);

        // Big confetti celebration
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 }
        });
    }, [currentLevel]);

    // Advance to next level
    const advanceLevel = () => {
        if (currentLevelIndex < LEVELS.length - 1) {
            setCurrentLevelIndex(i => i + 1);
            setGamePhase('playing');
            setAvatarState('idle');
        } else {
            setGamePhase('gameComplete');
        }
    };

    // Play again
    const playAgain = () => {
        resetSession();
        setCurrentLevelIndex(0);
        setScore(0);
        setTotalAttempts(0);
        setGamePhase('playing');
        setAvatarState('idle');
    };

    // Render welcome screen
    if (gamePhase === 'welcome') {
        return (
            <div className="geogenie-game welcome-screen">
                <button onClick={() => navigate('/')} className="home-btn">🏠</button>

                <div className="welcome-content">
                    <h1 className="game-title">
                        <span className="genie-icon">🌍</span>
                        GeoGenie
                        <span className="genie-icon">✨</span>
                    </h1>
                    <p className="game-subtitle">Your AI Geography Friend!</p>

                    <div className="level-preview">
                        {LEVELS.map((level, idx) => (
                            <div key={level.id} className="level-badge">
                                <span className="level-emoji">{level.emoji}</span>
                                <span className="level-name">{level.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mode-selector">
                        <button
                            className="mode-button train-mode"
                            onClick={() => handleStartGame('train')}
                            disabled={!isReady}
                        >
                            <span className="mode-icon">📚</span>
                            <span className="mode-label">Learn</span>
                            <span className="mode-desc">I'll teach you!</span>
                        </button>
                        <button
                            className="mode-button quiz-mode"
                            onClick={() => handleStartGame('quiz')}
                            disabled={!isReady}
                        >
                            <span className="mode-icon">🎯</span>
                            <span className="mode-label">Quiz</span>
                            <span className="mode-desc">Test yourself!</span>
                        </button>
                    </div>
                    {!isReady && <p className="loading-status">{initStatus}</p>}
                </div>

                <GeoGenieAvatar state="idle" size="large" />
            </div>
        );
    }

    // Render level complete screen
    if (gamePhase === 'levelComplete') {
        return (
            <div className="geogenie-game level-complete-screen">
                <div className="complete-content">
                    <h1 className="complete-title">
                        {currentLevel.emoji} Level Complete! {currentLevel.emoji}
                    </h1>
                    <p className="complete-message">
                        Amazing job, Explorer!
                    </p>
                    <div className="score-display">
                        Score: {score} / {totalAttempts}
                    </div>

                    {currentLevelIndex < LEVELS.length - 1 ? (
                        <>
                            <p className="next-level-hint">
                                Next: {LEVELS[currentLevelIndex + 1].name}
                            </p>
                            <button className="next-button" onClick={advanceLevel}>
                                Continue Adventure!
                            </button>
                        </>
                    ) : (
                        <button className="next-button" onClick={advanceLevel}>
                            See Results!
                        </button>
                    )}
                </div>

                <GeoGenieAvatar state="celebrating" size="large" />
            </div>
        );
    }

    // Render game complete screen
    if (gamePhase === 'gameComplete') {
        const accuracy = totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;
        return (
            <div className="geogenie-game game-complete-screen">
                <div className="complete-content">
                    <h1 className="complete-title">🎉 You Did It! 🎉</h1>
                    <p className="complete-message">
                        You're a Geography Star!
                    </p>
                    <div className="final-stats">
                        <div className="stat">
                            <span className="stat-value">{score}</span>
                            <span className="stat-label">Correct</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{accuracy}%</span>
                            <span className="stat-label">Accuracy</span>
                        </div>
                    </div>

                    <button className="play-again-button" onClick={playAgain}>
                        Play Again!
                    </button>
                    <button className="home-button" onClick={() => navigate('/')}>
                        Go Home
                    </button>
                </div>

                <GeoGenieAvatar state="celebrating" size="large" />
            </div>
        );
    }

    // Render playing phase
    return (
        <div className="geogenie-game playing-screen">
            <button onClick={() => navigate('/')} className="home-btn">🏠</button>

            {/* Level indicator */}
            <div className="level-indicator">
                <span className="level-emoji">{currentLevel.emoji}</span>
                <span className="level-name">{currentLevel.name}</span>
            </div>

            {/* Score */}
            <div className="score-hud">
                Score: {score}
            </div>

            {/* Level component */}
            <div className="level-container">
                {currentLevel.id === 'solar-system' && (
                    <SolarSystemLevel
                        gameMode={gameMode}
                        onCorrect={handleCorrect}
                        onIncorrect={handleIncorrect}
                        onNewTarget={handleNewTarget}
                        onLevelComplete={handleLevelComplete}
                        highlightedTarget={highlightedTarget}
                    />
                )}
                {currentLevel.id === 'world-map' && (
                    <WorldMapLevel
                        gameMode={gameMode}
                        onCorrect={handleCorrect}
                        onIncorrect={handleIncorrect}
                        onNewTarget={handleNewTarget}
                        onLevelComplete={handleLevelComplete}
                        highlightedTarget={highlightedTarget}
                    />
                )}
                {currentLevel.id === 'north-america' && (
                    <NorthAmericaLevel
                        gameMode={gameMode}
                        onCorrect={handleCorrect}
                        onIncorrect={handleIncorrect}
                        onNewTarget={handleNewTarget}
                        onLevelComplete={handleLevelComplete}
                        highlightedTarget={highlightedTarget}
                    />
                )}
                {currentLevel.id === 'us-states' && (
                    <USStatesLevel
                        gameMode={gameMode}
                        onCorrect={handleCorrect}
                        onIncorrect={handleIncorrect}
                        onNewTarget={handleNewTarget}
                        onLevelComplete={handleLevelComplete}
                        highlightedTarget={highlightedTarget}
                    />
                )}
            </div>

            {/* Avatar */}
            <GeoGenieAvatar state={avatarState} size="large" />

            {/* Progress dots */}
            <div className="level-progress">
                {LEVELS.map((level, idx) => (
                    <div
                        key={level.id}
                        className={`progress-dot ${idx === currentLevelIndex ? 'active' : ''} ${idx < currentLevelIndex ? 'completed' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default GeoGenieGame;
