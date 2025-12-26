import React, { useState, useEffect, useCallback, useRef } from 'react';
import LetterFish from './LetterFish';
import ScoreBoard from './ScoreBoard';
import confetti from 'canvas-confetti';
import { initPiper, speakText, phonetizeSentence } from '../../../utils/audio';
import trackingService from '../../../services/trackingService';

const ALPHABET_CAPS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const ALPHABET_SMALL = 'abcdefghijklmnopqrstuvwxyz'.split('');


const GameCanvas = ({ onGoBack, gameMode = 'capital', maxNumber = 10 }) => {
    const [score, setScore] = useState(0);

    const [attempts, setAttempts] = useState(0);
    const [targetLetter, setTargetLetter] = useState('');
    const [fish, setFish] = useState([]);
    const [audioStatus, setAudioStatus] = useState('Initializing Audio...');

    // Initialize Piper WASM
    useEffect(() => {
        initPiper((status) => {
            setAudioStatus(status);
        }).catch(err => {
            console.error("Audio init failed", err);
            // Don't overwrite if we already have a detailed failure message?
            // Actually, initPiper throws AFTER calling callback with "Failed: ..."
            // So we should just let the callback handle the status update.
        });
    }, []);

    // Audio setup
    const speak = useCallback((text) => {
        // Convert any single letters to phonetic sounds before speaking
        // e.g. "Fish me B" -> "Fish me Buh"
        const phoneticText = phonetizeSentence(text);
        speakText(phoneticText);
    }, []);

    // Use a ref to access the current fish state inside timeouts/callbacks if needed,
    // but we will pass fish as argument to helper functions to be pure.

    // State to track timeouts for cleanup
    const timeoutsRef = useRef([]);
    const addTimeout = useCallback((callback, delay) => {
        const id = setTimeout(() => {
            callback();
            timeoutsRef.current = timeoutsRef.current.filter(t => t !== id);
        }, delay);
        timeoutsRef.current.push(id);
    }, []); // No dependencies needed as timeoutsRef is stable

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach(clearTimeout);
        };
    }, []);

    const pickNewTarget = useCallback((currentFish) => {
        if (currentFish.length === 0) {
            // Level cleared!
            addTimeout(startLevel, 1000);
            return;
        }

        const randomFish = currentFish[Math.floor(Math.random() * currentFish.length)];
        setTargetLetter(randomFish.char);
        speak(`Fish me ${randomFish.char}`);
    }, [speak, addTimeout]);

    const startLevel = useCallback(() => {
        // Spawn 6-8 fish
        const count = 6 + Math.floor(Math.random() * 3);
        const newFish = [];

        // Helper to check overlap (simple distance check in % units)
        const isSafePosition = (x, y, existingFish) => {
            for (const fish of existingFish) {
                // Rough distance check: 12% horizontal, 15% vertical (due to aspect ratio)
                const dx = Math.abs(x - fish.x);
                const dy = Math.abs(y - fish.y);
                if (dx < 12 && dy < 15) return false;
            }
            return true;
        };

        // Select pool based on game mode
        let pool = [];
        if (gameMode === 'small') {
            pool = [...ALPHABET_SMALL];
        } else if (gameMode === 'number') {
            pool = Array.from({ length: maxNumber }, (_, i) => String(i + 1));
        } else {
            pool = [...ALPHABET_CAPS];
        }

        // Create a pool of available chars
        const availableChars = [...pool];

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Approximate safe dimensions including some wiggle/padding
        const fishWidthPx = 120;
        const fishHeightPx = 100;

        // Calculate maximum safe percentage positions
        // x% + (fishWidth/screenWidth * 100) should be < 95% (right margin)
        // So max_x% = 95 - (fishWidth/screenWidth * 100)
        const safeRightMargin = 5;
        const fishWidthPercent = (fishWidthPx / screenWidth) * 100;
        const maxX = 100 - safeRightMargin - fishWidthPercent;
        const minX = 5; // Left safe margin

        const safeBottomMargin = 5;
        const fishHeightPercent = (fishHeightPx / screenHeight) * 100;
        const maxY = 100 - safeBottomMargin - fishHeightPercent;
        const minY = 25; // Keep existing top margin for header

        for (let i = 0; i < count; i++) {
            // Pick a random index from availableChars
            const randomIndex = Math.floor(Math.random() * availableChars.length);
            const char = availableChars[randomIndex];

            // Remove the selected char from the pool to avoid duplicates
            availableChars.splice(randomIndex, 1);

            // Try to find a safe position
            let x, y;
            let valid = false;
            let attempts = 0;

            // Ensure ranges are valid (if screen is extremely small, fallback to small range)
            const xRange = Math.max(0, maxX - minX);
            const yRange = Math.max(0, maxY - minY);

            while (!valid && attempts < 50) {
                x = Math.random() * xRange + minX;
                y = Math.random() * yRange + minY;
                if (isSafePosition(x, y, newFish)) {
                    valid = true;
                }
                attempts++;
            }

            newFish.push({
                char,
                id: `${char}-${Date.now()}-${i}`,
                x,
                y,
            });
        }

        setFish(newFish);
        // Pick first target after a moment
        addTimeout(() => pickNewTarget(newFish), 1000);
    }, [pickNewTarget, addTimeout]);

    // Initial Start
    useEffect(() => {
        startLevel();
        // No cleanup for startLevel itself needed if we clean timeouts
    }, [startLevel]);

    const handleFishClick = (clickedFish) => {
        setAttempts(prev => prev + 1);

        if (clickedFish.char === targetLetter) {
            // Correct!
            trackingService.trackInteraction(targetLetter, clickedFish.char, true);
            setScore(prev => prev + 1);

            // Visual feedback
            confetti({
                particleCount: 50,
                spread: 50,
                origin: {
                    x: clickedFish.x / 100,
                    y: clickedFish.y / 100
                }
            });

            // Remove the caught fish
            const remainingFish = fish.filter(f => f.id !== clickedFish.id);
            setFish(remainingFish);

            // Play "Good job" and then ask for next
            const praise = ['Good job!', 'Great!', 'Awesome!', 'You got it!'];
            const randomPraise = praise[Math.floor(Math.random() * praise.length)];

            speak(`${randomPraise}`);

            // Wait a bit before asking for the next one
            if (remainingFish.length > 0) {
                addTimeout(() => pickNewTarget(remainingFish), 1500);
            } else {
                // Screen cleared
                speak("All cleared! Next round.");
                addTimeout(startLevel, 2000);
            }

        } else {
            // Incorrect
            trackingService.trackInteraction(targetLetter, clickedFish.char, false);
            speak(`That is ${clickedFish.char}. Try finding ${targetLetter}`);
        }
    };

    const handleReplay = () => {
        speak(`Fish me ${targetLetter}`);
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <ScoreBoard score={score} totalAttempts={attempts} />

            {/* Audio Status Indicator */}
            <div style={{
                position: 'absolute',
                top: '5px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.8rem',
                color: '#666',
                zIndex: 90
            }}>
                {audioStatus !== 'Ready' && audioStatus}
            </div>

            {/* Target Letter Display - Moved down to avoid overlap with score/controls */}
            {targetLetter && (
                <div style={{
                    position: 'absolute',
                    top: '90px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '10px 30px',
                    borderRadius: '50px',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#333',
                    zIndex: 100,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span>Fish me</span>
                    <span style={{ color: '#E63946', fontSize: '2.5rem' }}>{targetLetter}</span>
                </div>
            )}

            {/* Controls */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 100,
                display: 'flex',
                gap: '10px'
            }}>
                <button onClick={handleReplay} style={{ padding: '10px 20px', fontSize: '1.2rem' }}>
                    🔊 Hear Again
                </button>
                <button onClick={onGoBack} style={{ padding: '10px 20px', fontSize: '1.2rem' }}>
                    Exit
                </button>
            </div>

            {fish.map((f) => (
                <LetterFish
                    key={f.id}
                    letter={f.char}
                    position={{ x: f.x, y: f.y }}
                    onClick={() => handleFishClick(f)}
                />
            ))}

        </div>
    );
};

export default GameCanvas;
