// Solar System Level for GeoGenie
// Level 1: Identify planets in our Solar System

import React, { useState, useEffect, useCallback } from 'react';
import { PLANETS, solarSystemKnowledge } from '../data/solarSystemKnowledge';
import './LevelStyles.css';

// Only target planets, not the Sun
const TARGETABLE = PLANETS.filter(p => p.type === 'planet');

const SolarSystemLevel = ({
    gameMode,
    onCorrect,
    onIncorrect,
    onNewTarget,
    onLevelComplete,
    highlightedTarget
}) => {
    const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
    const [shuffledPlanets, setShuffledPlanets] = useState([]);
    const [foundPlanets, setFoundPlanets] = useState([]);
    const [wrongPlanet, setWrongPlanet] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Shuffle planets on mount (for quiz mode, train goes in order)
    useEffect(() => {
        if (gameMode === 'train') {
            setShuffledPlanets([...TARGETABLE]);
        } else {
            const shuffled = [...TARGETABLE].sort(() => Math.random() - 0.5);
            setShuffledPlanets(shuffled);
        }
    }, [gameMode]);

    // Announce target when ready
    useEffect(() => {
        if (shuffledPlanets.length > 0 && currentTargetIndex < shuffledPlanets.length) {
            const target = shuffledPlanets[currentTargetIndex];
            onNewTarget(target.name);
        }
    }, [currentTargetIndex, shuffledPlanets, onNewTarget]);

    const currentTarget = shuffledPlanets[currentTargetIndex];
    const currentKnowledge = currentTarget ? solarSystemKnowledge[currentTarget.name] : null;

    // Handle planet click (quiz mode)
    const handlePlanetClick = useCallback(async (planet) => {
        if (gameMode === 'train') return; // In train mode, clicking doesn't do anything
        if (isProcessing || !currentTarget) return;
        if (planet.type === 'star') return; // Can't click the Sun
        if (foundPlanets.includes(planet.name)) return; // Already found

        setIsProcessing(true);

        if (planet.name === currentTarget.name) {
            // Correct!
            setFoundPlanets(prev => [...prev, planet.name]);
            await onCorrect(planet.name);

            // Next planet or level complete
            if (currentTargetIndex + 1 >= shuffledPlanets.length) {
                onLevelComplete();
            } else {
                setCurrentTargetIndex(i => i + 1);
            }
        } else {
            // Incorrect
            setWrongPlanet(planet.name);
            await onIncorrect(currentTarget.name, planet.name);
            setTimeout(() => setWrongPlanet(null), 800);
        }

        setIsProcessing(false);
    }, [gameMode, currentTarget, currentTargetIndex, shuffledPlanets, foundPlanets, isProcessing, onCorrect, onIncorrect, onLevelComplete]);

    // Handle Next button (train mode)
    const handleNext = useCallback(async () => {
        if (isProcessing || !currentTarget) return;
        setIsProcessing(true);

        setFoundPlanets(prev => [...prev, currentTarget.name]);
        await onCorrect(currentTarget.name);

        if (currentTargetIndex + 1 >= shuffledPlanets.length) {
            onLevelComplete();
        } else {
            setCurrentTargetIndex(i => i + 1);
        }

        setIsProcessing(false);
    }, [currentTarget, currentTargetIndex, shuffledPlanets, isProcessing, onCorrect, onLevelComplete]);

    return (
        <div className="solar-system-level">
            {/* Target instruction */}
            <div className="target-instruction">
                {gameMode === 'train'
                    ? (currentTarget ? `This is ${currentTarget.name}!` : 'Loading...')
                    : (currentTarget ? `Find ${currentTarget.name}!` : 'Loading...')
                }
            </div>

            {/* Train mode info card */}
            {gameMode === 'train' && currentKnowledge && (
                <div className="train-info-card">
                    <p className="train-fact">{currentKnowledge.funFact}</p>
                    <button className="train-next-btn" onClick={handleNext} disabled={isProcessing}>
                        Next Planet →
                    </button>
                </div>
            )}

            {/* Planet display */}
            <div className="planets-container">
                {PLANETS.map((planet) => {
                    const isFound = foundPlanets.includes(planet.name);
                    const isHighlighted = highlightedTarget === planet.name ||
                        (gameMode === 'train' && currentTarget?.name === planet.name);
                    const isWrong = wrongPlanet === planet.name;

                    return (
                        <div
                            key={planet.name}
                            className={`planet-item ${isFound ? 'found' : ''} ${isHighlighted ? 'highlighted' : ''} ${isWrong ? 'shake' : ''}`}
                            onClick={() => handlePlanetClick(planet)}
                            style={{ cursor: gameMode === 'quiz' && planet.type === 'planet' && !isFound ? 'pointer' : 'default' }}
                        >
                            <div
                                className={`planet-sphere ${planet.name.toLowerCase()}`}
                                style={{
                                    width: planet.size + 'px',
                                    height: planet.size + 'px',
                                    backgroundColor: planet.color,
                                    boxShadow: isHighlighted
                                        ? `0 0 30px ${planet.color}, 0 0 60px ${planet.color}`
                                        : `0 0 15px ${planet.color}40`
                                }}
                            >
                                {/* Saturn rings */}
                                {planet.name === 'Saturn' && (
                                    <div className="saturn-ring" />
                                )}
                            </div>
                            <div className="planet-label">{planet.name}</div>
                            {isFound && <div className="found-check">✓</div>}
                        </div>
                    );
                })}
            </div>

            {/* Progress */}
            <div className="level-progress-text">
                {foundPlanets.length} / {TARGETABLE.length} planets {gameMode === 'train' ? 'learned' : 'found'}
            </div>
        </div>
    );
};

export default SolarSystemLevel;

