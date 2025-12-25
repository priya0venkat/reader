// US States Level for GeoGenie
// Level 4: Identify US states (all 50 states!)

import React, { useState, useEffect, useCallback } from 'react';
import { stateKnowledge } from '../data/usStatesKnowledge';
import { statesData, statesList } from '../../us-map-game/data/states';
import { centroids } from '../../us-map-game/data/centroids';
import './LevelStyles.css';

// States ordered roughly by size (biggest first) for easier gameplay
const STATES_BY_SIZE = [
    'Alaska', 'Texas', 'California', 'Montana', 'New Mexico', 'Arizona', 'Nevada', 'Colorado',
    'Oregon', 'Wyoming', 'Michigan', 'Minnesota', 'Utah', 'Idaho', 'Kansas', 'Nebraska',
    'South Dakota', 'Washington', 'North Dakota', 'Oklahoma', 'Missouri', 'Florida', 'Wisconsin', 'Georgia',
    'Illinois', 'Iowa', 'New York', 'North Carolina', 'Arkansas', 'Alabama', 'Louisiana', 'Mississippi',
    'Pennsylvania', 'Ohio', 'Virginia', 'Tennessee', 'Kentucky', 'Indiana', 'Maine', 'South Carolina',
    'West Virginia', 'Maryland', 'Hawaii', 'Massachusetts', 'Vermont', 'New Hampshire', 'New Jersey',
    'Connecticut', 'Delaware', 'Rhode Island'
];

// Shuffle within size groups for variety
const shuffleBySize = () => {
    const groupSize = 8;
    const result = [];
    for (let i = 0; i < STATES_BY_SIZE.length; i += groupSize) {
        const group = STATES_BY_SIZE.slice(i, i + groupSize);
        group.sort(() => Math.random() - 0.5);
        result.push(...group);
    }
    return result;
};

const USStatesLevel = ({
    gameMode,
    onCorrect,
    onIncorrect,
    onNewTarget,
    onLevelComplete,
    highlightedTarget
}) => {
    const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
    const [shuffledStates, setShuffledStates] = useState([]);
    const [foundStates, setFoundStates] = useState([]);
    const [wrongState, setWrongState] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Order states - in train mode, keep order; in quiz, shuffle within groups
    useEffect(() => {
        if (gameMode === 'train') {
            setShuffledStates([...STATES_BY_SIZE]);
        } else {
            setShuffledStates(shuffleBySize());
        }
    }, [gameMode]);

    // Announce target when ready
    useEffect(() => {
        if (shuffledStates.length > 0 && currentTargetIndex < shuffledStates.length) {
            const target = shuffledStates[currentTargetIndex];
            onNewTarget(target);
        }
    }, [currentTargetIndex, shuffledStates, onNewTarget]);

    const currentTarget = shuffledStates[currentTargetIndex];
    const currentKnowledge = currentTarget ? stateKnowledge[currentTarget] : null;

    const handleStateClick = useCallback(async (stateName) => {
        if (gameMode === 'train') return;
        if (isProcessing || !currentTarget) return;
        if (foundStates.includes(stateName)) return;

        setIsProcessing(true);

        if (stateName === currentTarget) {
            setFoundStates(prev => [...prev, stateName]);
            await onCorrect(stateName);

            if (currentTargetIndex + 1 >= shuffledStates.length) {
                onLevelComplete();
            } else {
                setCurrentTargetIndex(i => i + 1);
            }
        } else {
            setWrongState(stateName);
            await onIncorrect(currentTarget, stateName);
            setTimeout(() => setWrongState(null), 800);
        }

        setIsProcessing(false);
    }, [gameMode, currentTarget, currentTargetIndex, shuffledStates, foundStates, isProcessing, onCorrect, onIncorrect, onLevelComplete]);

    // Handle Next button (train mode)
    const handleNext = useCallback(async () => {
        if (isProcessing || !currentTarget) return;
        setIsProcessing(true);

        setFoundStates(prev => [...prev, currentTarget]);
        await onCorrect(currentTarget);

        if (currentTargetIndex + 1 >= shuffledStates.length) {
            onLevelComplete();
        } else {
            setCurrentTargetIndex(i => i + 1);
        }

        setIsProcessing(false);
    }, [currentTarget, currentTargetIndex, shuffledStates, isProcessing, onCorrect, onLevelComplete]);

    return (
        <div className="us-states-level">
            <div className="target-instruction">
                {gameMode === 'train'
                    ? (currentTarget ? `This is ${currentTarget}!` : 'Loading...')
                    : (currentTarget ? `Find ${currentTarget}!` : 'Loading...')
                }
            </div>

            {/* Train mode info card */}
            {gameMode === 'train' && currentKnowledge && (
                <div className="train-info-card">
                    <p className="train-fact">{currentKnowledge.funFact || `${currentTarget} is a beautiful state!`}</p>
                    <button className="train-next-btn" onClick={handleNext} disabled={isProcessing}>
                        Next State →
                    </button>
                </div>
            )}

            <div className="map-svg-container">
                <svg viewBox="0 0 959 593" preserveAspectRatio="xMidYMid meet">
                    <rect x="0" y="0" width="959" height="593" fill="#1e3a5f" />

                    {Object.entries(statesData).map(([stateName, stateData]) => {
                        const isFound = foundStates.includes(stateName);
                        const isHighlighted = highlightedTarget === stateName ||
                            (gameMode === 'train' && currentTarget === stateName);
                        const isWrong = wrongState === stateName;

                        return (
                            <path
                                key={stateData.id}
                                d={stateData.path}
                                fill={isFound ? '#4caf50' : stateData.color}
                                stroke="#fff"
                                strokeWidth="1"
                                className={`state-path ${isFound ? 'found' : ''} ${isHighlighted ? 'highlighted' : ''} ${isWrong ? 'wrong' : ''}`}
                                onClick={() => handleStateClick(stateName)}
                                style={{ cursor: gameMode === 'quiz' && !isFound ? 'pointer' : 'default' }}
                            />
                        );
                    })}

                    {Object.entries(statesData).map(([stateName, stateData]) => {
                        const centroid = centroids[stateName];
                        if (!centroid) return null;
                        const isFound = foundStates.includes(stateName);

                        return (
                            <text
                                key={`label-${stateData.id}`}
                                x={centroid.x}
                                y={centroid.y}
                                fill={isFound ? '#fff' : '#000'}
                                fontSize="10"
                                fontWeight="bold"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                style={{
                                    pointerEvents: 'none',
                                    textShadow: isFound ? '0 1px 2px rgba(0,0,0,0.8)' : '0 0 2px rgba(255,255,255,0.8)'
                                }}
                            >
                                {stateData.id}
                            </text>
                        );
                    })}
                </svg>
            </div>

            <div className="level-progress-text">
                {foundStates.length} / {STATES_BY_SIZE.length} states {gameMode === 'train' ? 'learned' : 'found'}
            </div>
        </div>
    );
};

// Add shape hint styles
const hintStyles = `
.shape-hint {
    background: rgba(255, 255, 255, 0.1);
    padding: 8px 18px;
    border-radius: 15px;
    font-size: 0.85rem;
    color: #4fc3f7;
    margin-top: 8px;
}
`;

if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.textContent = hintStyles;
    document.head.appendChild(styleEl);
}

export default USStatesLevel;
