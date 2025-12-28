// GeoGenie Game - Main Container Component
// AI-powered geography tutor with 4 adaptive levels

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { saveStats } from './statsService';

// Level definitions
const LEVELS = [
    { id: 'solar-system', name: 'Space Explorer', emoji: '🚀', description: 'Find the planets!' },
    { id: 'world-map', name: 'World Traveler', emoji: '🌍', description: 'Explore the continents!' },
    { id: 'north-america', name: 'America Explorer', emoji: '🦅', description: 'Explore North America!' },
    { id: 'us-states', name: 'State Master', emoji: '🇺🇸', description: 'Learn the US States!' }
];

function GeoGenieGame() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Parse initial state from URL
    const initialLevelId = searchParams.get('level');
    const initialMode = searchParams.get('mode');
    const initialLevelIndex = initialLevelId ? LEVELS.findIndex(l => l.id === initialLevelId) : 0;

    // Game state
    const [gamePhase, setGamePhase] = useState(initialMode ? 'playing' : 'welcome');
    const [gameMode, setGameMode] = useState(initialMode || null);
    const [currentLevelIndex, setCurrentLevelIndex] = useState(initialLevelIndex >= 0 ? initialLevelIndex : 0);
    const [score, setScore] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);

    // Stats state
    const [levelStats, setLevelStats] = useState({}); // { entityName: { correct: 0, incorrect: 0 } }
    const [startTime, setStartTime] = useState(Date.now());

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

        // Reset stats
        setLevelStats({});
        setStartTime(Date.now());

        // Update URL
        setSearchParams({ mode, level: LEVELS[0].id });
    };

    // Start next level
    const startNextLevel = () => {
        // Reset per-level stats
        setLevelStats({});
        setScore(0);
        setTotalAttempts(0);
        setStartTime(Date.now());
        resetSession();

        if (currentLevelIndex < LEVELS.length - 1) {
            const nextIndex = currentLevelIndex + 1;
            setCurrentLevelIndex(nextIndex);
            setGamePhase('playing');
            setAvatarState('idle');

            // Update URL
            setSearchParams({ mode: gameMode, level: LEVELS[nextIndex].id });
        } else {
            setGamePhase('gameComplete');
            // Clear URL params on game complete
            setSearchParams({});
        }
    }

    // Handle correct answer from level
    const handleCorrect = useCallback(async (entityName) => {
        setHighlightedTarget(null);
        setAvatarState('celebrating');

        // Only track score in quiz mode
        if (gameMode === 'quiz') {
            setScore(s => s + 1);
            setTotalAttempts(t => t + 1);

            // Track entity stats
            setLevelStats(prev => {
                const current = prev[entityName] || { correct: 0, incorrect: 0 };
                return {
                    ...prev,
                    [entityName]: { ...current, correct: current.correct + 1 }
                };
            });
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

        // Track stats
        if (gameMode === 'quiz') {
            setLevelStats(prev => {
                const current = prev[targetEntity] || { correct: 0, incorrect: 0 };
                return {
                    ...prev,
                    [targetEntity]: { ...current, incorrect: current.incorrect + 1 }
                };
            });
        }

        setTimeout(() => setAvatarState('speaking'), 500);

        const result = await handleIncorrectAnswer(targetEntity, clickedEntity, currentLevel.id);

        // Handle rescue mode highlighting
        if (result.isRescue && result.visualCommand?.action === 'highlight') {
            setHighlightedTarget(result.visualCommand.target);
        }

        setTimeout(() => setAvatarState('idle'), 2000);
    }, [currentLevel, gameMode]);

    // Handle turn start (new target)
    const handleNewTarget = useCallback(async (targetEntity, specificFact = null) => {
        startTurn(targetEntity, currentLevel.id);
        setAvatarState('speaking');
        await announceTarget(targetEntity, currentLevel.id, gameMode, specificFact);
        setTimeout(() => setAvatarState('idle'), 1000);
    }, [currentLevel, gameMode]);

    // Handle level completion
    const handleLevelComplete = useCallback(async () => {
        setGamePhase('levelComplete');
        setAvatarState('celebrating');

        await announceLevelComplete(currentLevel.id);

        // Save stats to backend
        if (gameMode === 'quiz') {
            const duration = Math.round((Date.now() - startTime) / 1000);
            saveStats({
                gameId: 'geogenie',
                levelId: currentLevel.id,
                score,
                totalAttempts,
                duration,
                entities: levelStats,
                mode: gameMode
            });
        }

        // Big confetti celebration
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 }
        });
    }, [currentLevel, gameMode, score, totalAttempts, startTime, levelStats]);

    // Advance to next level (mapped to UI button)
    const advanceLevel = () => {
        startNextLevel();
    };

    // Play again
    const playAgain = () => {
        handleStartGame(gameMode);
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
                        <div className="score-item">
                            <span className="label">Score</span>
                            <span className="value">{score} / {totalAttempts}</span>
                        </div>
                        {gameMode === 'quiz' && (
                            <div className="stats-grid">
                                <h3>Level Stats</h3>
                                <div className="stats-list">
                                    {Object.entries(levelStats).map(([name, stat]) => (
                                        (stat.incorrect > 0) && (
                                            <div key={name} className="stat-row warning">
                                                <span>{name}</span>
                                                <span>{stat.incorrect} mistakes</span>
                                            </div>
                                        )
                                    ))}
                                    {Object.keys(levelStats).length === 0 && <p>Perfect logic!</p>}
                                </div>
                            </div>
                        )}
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
        // ... existing game complete logic (can use accumulated stats if we wanted, but simple valid here)
        const accuracy = totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;
        return (
            <div className="geogenie-game game-complete-screen">
                <div className="complete-content">
                    <h1 className="complete-title">🎉 You Did It! 🎉</h1>
                    <p className="complete-message">
                        You're a Geography Star!
                    </p>
                    <div className="final-stats">
                        {/* We could show total session stats here if we tracked them globally, 
                            but based on current logic these are just last level stats unless we accumulated them. 
                            Simple restart for now. */}
                        <p>Thanks for playing!</p>
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

    // ... render playing ...


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

            {/* Level links for quick navigation */}
            <div className="level-nav-links">
                {LEVELS.map((level, idx) => (
                    <button
                        key={level.id}
                        onClick={() => {
                            setCurrentLevelIndex(idx);
                            setSearchParams({ mode: gameMode, level: level.id });
                            setLevelStats({});
                            setScore(0);
                            setTotalAttempts(0);
                            setStartTime(Date.now());
                            resetSession();
                        }}
                        className={`level-nav-link ${idx === currentLevelIndex ? 'active' : ''}`}
                    >
                        {level.emoji} {level.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default GeoGenieGame;
