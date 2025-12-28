// North America Level for GeoGenie
// Level 3: Identify countries in North America

import React, { useState, useEffect, useCallback } from 'react';
import { countriesList, countryKnowledge } from '../data/northAmericaKnowledge';
import { countriesData } from '../../north-america-map-game/data/countries';
import './LevelStyles.css';

// Simpler list for 5-year-olds (all regions from north-america-map-game)
const COUNTRIES = [
    { name: 'Canada', flag: '🇨🇦' },
    { name: 'United States', flag: '🇺🇸' },
    { name: 'Mexico', flag: '🇲🇽' },
    { name: 'Central America', flag: '🌴' },
    { name: 'The Caribbean', flag: '🏝️' }
];

const NorthAmericaLevel = ({
    gameMode,
    onCorrect,
    onIncorrect,
    onNewTarget,
    onLevelComplete,
    highlightedTarget
}) => {
    const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
    const [shuffledCountries, setShuffledCountries] = useState([]);
    const [foundCountries, setFoundCountries] = useState([]);
    const [wrongCountry, setWrongCountry] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Order states - in train mode, keep order; in quiz, shuffle within groups
    useEffect(() => {
        if (gameMode === 'train') {
            setShuffledCountries([...COUNTRIES]);
        } else {
            const shuffled = [...COUNTRIES].sort(() => Math.random() - 0.5);
            setShuffledCountries(shuffled);
        }
    }, [gameMode]);

    const currentTarget = shuffledCountries[currentTargetIndex];
    const currentKnowledge = currentTarget ? countryKnowledge[currentTarget.name] : null;

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
        if (shuffledCountries.length > 0 && currentTargetIndex < shuffledCountries.length) {
            const target = shuffledCountries[currentTargetIndex];
            // Pass the selected fact so audio matches text
            onNewTarget(target.name, currentFunFact);
        }
    }, [currentTargetIndex, shuffledCountries, onNewTarget, currentFunFact]);

    const handleCountryClick = useCallback(async (countryName) => {
        if (gameMode === 'train') return;
        if (isProcessing || !currentTarget) return;
        if (foundCountries.includes(countryName)) return;

        setIsProcessing(true);

        if (countryName === currentTarget.name) {
            setFoundCountries(prev => [...prev, countryName]);
            await onCorrect(countryName);

            if (currentTargetIndex + 1 >= shuffledCountries.length) {
                onLevelComplete();
            } else {
                setCurrentTargetIndex(i => i + 1);
            }
        } else {
            setWrongCountry(countryName);
            await onIncorrect(currentTarget.name, countryName);
            setTimeout(() => setWrongCountry(null), 800);
        }

        setIsProcessing(false);
    }, [gameMode, currentTarget, currentTargetIndex, shuffledCountries, foundCountries, isProcessing, onCorrect, onIncorrect, onLevelComplete]);

    // Handle Next button (train mode)
    const handleNext = useCallback(async () => {
        if (isProcessing || !currentTarget) return;
        setIsProcessing(true);

        setFoundCountries(prev => [...prev, currentTarget.name]);
        await onCorrect(currentTarget.name);

        if (currentTargetIndex + 1 >= shuffledCountries.length) {
            onLevelComplete();
        } else {
            setCurrentTargetIndex(i => i + 1);
        }

        setIsProcessing(false);
    }, [currentTarget, currentTargetIndex, shuffledCountries, isProcessing, onCorrect, onLevelComplete]);

    const displayFact = currentFunFact || `${currentTarget?.name} is a beautiful place!`;

    return (
        <div className="north-america-level">
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
                        Next Region →
                    </button>
                </div>
            )}

            <div className="map-svg-container">
                <svg viewBox="250 270 500 550" preserveAspectRatio="xMidYMid meet">
                    <rect x="250" y="270" width="500" height="550" fill="#1e3a5f" />

                    {COUNTRIES.map((country) => {
                        const data = countriesData[country.name];
                        if (!data) return null;

                        const isFound = foundCountries.includes(country.name);
                        const isHighlighted = highlightedTarget === country.name ||
                            (gameMode === 'train' && currentTarget?.name === country.name);
                        const isWrong = wrongCountry === country.name;

                        return (
                            <g key={country.name}>
                                <path
                                    d={data.path}
                                    fill={isFound ? '#4caf50' : data.color}
                                    className={`country-item ${isFound ? 'found' : ''} ${isHighlighted ? 'highlighted' : ''} ${isWrong ? 'shake' : ''}`}
                                    onClick={() => handleCountryClick(country.name)}
                                    style={{ cursor: gameMode === 'quiz' && !isFound ? 'pointer' : 'default' }}
                                />
                                <text
                                    x={data.labelX}
                                    y={data.labelY}
                                    fill="white"
                                    fontSize="16"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    style={{ pointerEvents: 'none', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                                >
                                    {country.flag} {country.name}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Body metaphor hint */}
            <div className="body-metaphor">
                🎓 Remember: Canada is the <strong>hat</strong>, USA is the <strong>face</strong>, Mexico is the <strong>beard</strong>!
            </div>

            <div className="level-progress-text">
                {foundCountries.length} / {COUNTRIES.length} regions {gameMode === 'train' ? 'learned' : 'found'}
            </div>
        </div>
    );
};

// Add body metaphor styles
const metaphorStyles = `
.body-metaphor {
    background: rgba(255, 255, 255, 0.1);
    padding: 10px 20px;
    border-radius: 15px;
    font-size: 0.9rem;
    color: #aaa;
    margin-top: 10px;
}
.body-metaphor strong {
    color: #4fc3f7;
}
`;

if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.textContent = metaphorStyles;
    document.head.appendChild(styleEl);
}

export default NorthAmericaLevel;
