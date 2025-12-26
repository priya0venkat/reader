// World Map Level for GeoGenie
// Level 2: Identify continents using Montessori colors

import React, { useState, useEffect, useCallback } from 'react';
import { continentKnowledge } from '../data/worldMapKnowledge';
import { continentData } from '../../world-map-game/data/continents';
import './LevelStyles.css';

// Map continent ids to names and colors (Montessori)
const CONTINENTS = [
    { id: 'NA', name: 'North America', color: '#FF8C00' },
    { id: 'SA', name: 'South America', color: '#FF69B4' },
    { id: 'EU', name: 'Europe', color: '#DC143C' },
    { id: 'AF', name: 'Africa', color: '#228B22' },
    { id: 'AS', name: 'Asia', color: '#FFD700' },
    { id: 'OC', name: 'Australia', color: '#8B4513' },
    { id: 'AN', name: 'Antarctica', color: '#E8E8E8' }
];

const WorldMapLevel = ({
    gameMode,
    onCorrect,
    onIncorrect,
    onNewTarget,
    onLevelComplete,
    highlightedTarget
}) => {
    const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
    const [shuffledContinents, setShuffledContinents] = useState([]);
    const [foundContinents, setFoundContinents] = useState([]);
    const [wrongContinent, setWrongContinent] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Shuffle continents (quiz) or keep order (train)
    useEffect(() => {
        if (gameMode === 'train') {
            setShuffledContinents([...CONTINENTS]);
        } else {
            const shuffled = [...CONTINENTS].sort(() => Math.random() - 0.5);
            setShuffledContinents(shuffled);
        }
    }, [gameMode]);

    const currentTarget = shuffledContinents[currentTargetIndex];
    const currentKnowledge = currentTarget ? continentKnowledge[currentTarget.name] : null;

    // Select a consistent random fact for the current target
    const currentFunFact = React.useMemo(() => {
        if (!currentKnowledge?.funFact) return null;
        if (Array.isArray(currentKnowledge.funFact)) {
            return currentKnowledge.funFact[Math.floor(Math.random() * currentKnowledge.funFact.length)];
        }
        return currentKnowledge.funFact;
    }, [currentTarget, currentKnowledge]);

    // Announce target when ready
    useEffect(() => {
        if (shuffledContinents.length > 0 && currentTargetIndex < shuffledContinents.length) {
            const target = shuffledContinents[currentTargetIndex];
            // Pass the selected fact so audio matches text
            onNewTarget(target.name, currentFunFact);
        }
    }, [currentTargetIndex, shuffledContinents, onNewTarget, currentFunFact]);

    const handleContinentClick = useCallback(async (continent) => {
        if (gameMode === 'train') return;
        if (isProcessing || !currentTarget) return;
        if (foundContinents.includes(continent.name)) return;

        setIsProcessing(true);

        if (continent.name === currentTarget.name) {
            setFoundContinents(prev => [...prev, continent.name]);
            await onCorrect(continent.name);

            if (currentTargetIndex + 1 >= shuffledContinents.length) {
                onLevelComplete();
            } else {
                setCurrentTargetIndex(i => i + 1);
            }
        } else {
            setWrongContinent(continent.name);
            await onIncorrect(currentTarget.name, continent.name);
            setTimeout(() => setWrongContinent(null), 800);
        }

        setIsProcessing(false);
    }, [gameMode, currentTarget, currentTargetIndex, shuffledContinents, foundContinents, isProcessing, onCorrect, onIncorrect, onLevelComplete]);

    // Handle Next button (train mode)
    const handleNext = useCallback(async () => {
        if (isProcessing || !currentTarget) return;
        setIsProcessing(true);

        setFoundContinents(prev => [...prev, currentTarget.name]);
        await onCorrect(currentTarget.name);

        if (currentTargetIndex + 1 >= shuffledContinents.length) {
            onLevelComplete();
        } else {
            setCurrentTargetIndex(i => i + 1);
        }

        setIsProcessing(false);
    }, [currentTarget, currentTargetIndex, shuffledContinents, isProcessing, onCorrect, onLevelComplete]);

    const displayFact = currentFunFact || '';

    return (
        <div className="world-map-level">
            <div className="target-instruction">
                {gameMode === 'train'
                    ? (currentTarget ? `This is ${currentTarget.name}!` : 'Loading...')
                    : (currentTarget ? `Find ${currentTarget.name}!` : 'Loading...')
                }
            </div>

            {/* Train mode info card */}
            {gameMode === 'train' && currentKnowledge && (
                <div className="train-info-card">
                    <p className="train-fact">{displayFact}</p>
                    <button className="train-next-btn" onClick={handleNext} disabled={isProcessing}>
                        Next Continent →
                    </button>
                </div>
            )}

            <div className="map-svg-container">
                <svg viewBox="0 0 700 400" preserveAspectRatio="xMidYMid meet">
                    <rect x="0" y="0" width="700" height="400" fill="#1e3a5f" />

                    {CONTINENTS.map((continent) => {
                        const data = continentData[continent.id];
                        if (!data) return null;

                        const isFound = foundContinents.includes(continent.name);
                        const isHighlighted = highlightedTarget === continent.name ||
                            (gameMode === 'train' && currentTarget?.name === continent.name);
                        const isWrong = wrongContinent === continent.name;

                        return (
                            <g key={continent.id}>
                                {data.paths.map((pathD, idx) => (
                                    <path
                                        key={`${continent.id}-${idx}`}
                                        d={pathD}
                                        fill={isFound ? '#4caf50' : continent.color}
                                        className={`continent-path ${isFound ? 'found' : ''} ${isHighlighted ? 'highlighted' : ''} ${isWrong ? 'wrong' : ''}`}
                                        onClick={() => handleContinentClick(continent)}
                                        style={{ cursor: gameMode === 'quiz' && !isFound ? 'pointer' : 'default' }}
                                    />
                                ))}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Color legend */}
            <div className="continent-legend">
                {CONTINENTS.map((c) => (
                    <div key={c.id} className="legend-item">
                        <span className="legend-color" style={{ background: c.color }} />
                        <span className="legend-name">{c.name}</span>
                        {foundContinents.includes(c.name) && <span className="legend-check">✓</span>}
                    </div>
                ))}
            </div>

            <div className="level-progress-text">
                {foundContinents.length} / {CONTINENTS.length} continents {gameMode === 'train' ? 'learned' : 'found'}
            </div>
        </div>
    );
};

// Add legend styles
const legendStyles = `
.continent-legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
}
.legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.8rem;
    color: #ccc;
}
.legend-color {
    width: 16px;
    height: 16px;
    border-radius: 3px;
}
.legend-check {
    color: #4caf50;
    font-weight: bold;
}
`;

// Inject legend styles
if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.textContent = legendStyles;
    document.head.appendChild(styleEl);
}

export default WorldMapLevel;
