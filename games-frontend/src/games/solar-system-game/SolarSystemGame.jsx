import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { initPiper, speakText } from '../../utils/audio';
import './SolarSystemGame.css';

// Planet data with fallback colors and relative sizes
const PLANETS = [
    { name: 'Sun', color: '#FDB813', size: 120, type: 'star' },
    { name: 'Mercury', color: '#A5A5A5', size: 30, type: 'planet' },
    { name: 'Venus', color: '#E3BB76', size: 50, type: 'planet' },
    { name: 'Earth', color: '#22A6B3', size: 52, type: 'planet' },
    { name: 'Mars', color: '#DD4C3A', size: 40, type: 'planet' },
    { name: 'Jupiter', color: '#D9A066', size: 100, type: 'planet' },
    { name: 'Saturn', color: '#EAD6B8', size: 90, type: 'planet' }, // Rings handled in CSS if possible
    { name: 'Uranus', color: '#D1F2F8', size: 60, type: 'planet' },
    { name: 'Neptune', color: '#4b70dd', size: 58, type: 'planet' }
];

// Targetable bodies (usually just planets, maybe Sun too? The prompt said "touch the right PLANET", but usually Sun is included in these games. I'll include planets only for now based on "touch the right PLANET", but I'll add Sun to the layout.)
// Wait, "touch the right planet in our Solar system". Sun is a star.
// I will exclude Sun from being a target unless requested, but display it.
const TARGETABLE_PLANETS = PLANETS.filter(p => p.type === 'planet');

function SolarSystemGame() {
    const navigate = useNavigate();
    const [targetPlanet, setTargetPlanet] = useState(null);
    const [audioStatus, setAudioStatus] = useState('Initializing Audio...');
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [wrongGuess, setWrongGuess] = useState(null); // name of planet guessed wrong

    // Audio init
    useEffect(() => {
        initPiper((status) => {
            setAudioStatus(status);
        }).catch(err => console.error("Audio init failed", err));
    }, []);

    // Start game / Next turn
    const nextTurn = useCallback(() => {
        const randomPlanet = TARGETABLE_PLANETS[Math.floor(Math.random() * TARGETABLE_PLANETS.length)];
        setTargetPlanet(randomPlanet);
        speakText(`Find ${randomPlanet.name}`);
        setWrongGuess(null);
    }, []);

    // Initial start
    useEffect(() => {
        // slight delay to allow audio to load, but we can start visuals immediately
        const timer = setTimeout(() => {
            nextTurn();
        }, 1000);
        return () => clearTimeout(timer);
    }, [nextTurn]);

    const handlePlanetClick = (planet) => {
        if (!targetPlanet || planet.type === 'star') return; // Ignore Sun clicks for now? Or say "That is the Sun"?

        if (planet.name === targetPlanet.name) {
            // Correct
            setScore(s => s + 1);
            setAttempts(a => a + 1);
            speakText(`Good job! You found ${planet.name}.`);

            // Confetti at click position would be nice, but here we just do center confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            setTimeout(() => {
                nextTurn();
            }, 2000);
        } else {
            // Incorrect
            setAttempts(a => a + 1);
            setWrongGuess(planet.name);
            speakText(`This is ${planet.name}. Find ${targetPlanet.name}.`);

            // Clear wrong guess animation after a bit
            setTimeout(() => setWrongGuess(null), 1000);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    const handleReplayAudio = () => {
        if (targetPlanet) {
            speakText(`Find ${targetPlanet.name}`);
        }
    };

    return (
        <div className="solar-system-game">
            <div className="star-background"></div>

            {/* Header / HUD */}
            <div className="game-hud">
                <button className="back-button" onClick={handleBack}>
                    ← Exit
                </button>
                <div className="score-display">
                    Score: {score} / {attempts}
                </div>
                <button className="replay-audio-button" onClick={handleReplayAudio}>
                    🔊 Hear Again
                </button>
            </div>

            {/* Instruction */}
            <div className="instruction-banner">
                {targetPlanet ? `Find ${targetPlanet.name}` : 'Loading...'}
            </div>

            {/* Solar System Layout */}
            <div className="solar-system-container">
                {PLANETS.map((planet, index) => (
                    <div
                        key={planet.name}
                        className={`planet-wrapper ${wrongGuess === planet.name ? 'shake' : ''}`}
                        onClick={() => handlePlanetClick(planet)}
                        style={{
                            cursor: planet.type === 'planet' ? 'pointer' : 'default'
                        }}
                    >
                        {/* Use CSS Circle for now, will replace with img tag if assets exist */}
                        <div
                            className={`planet-visual ${planet.name.toLowerCase()}`}
                            style={{
                                width: planet.size + 'px',
                                height: planet.size + 'px',
                                backgroundColor: planet.color,
                                boxShadow: `0 0 10px ${planet.color}80` // Glow
                            }}
                            title={planet.name}
                        >
                            {/* Inner detail for some texture if CSS only */}
                        </div>
                        <div className="planet-label">{planet.name}</div>
                    </div>
                ))}
            </div>

            {/* Audio Status */}
            <div className="audio-status">
                {audioStatus !== 'Ready' && audioStatus}
            </div>
        </div>
    );
}

export default SolarSystemGame;
