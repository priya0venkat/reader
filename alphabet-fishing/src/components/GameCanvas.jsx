import React, { useState, useEffect, useCallback, useRef } from 'react';
import LetterFish from './LetterFish';
import ScoreBoard from './ScoreBoard';
import confetti from 'canvas-confetti';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');


const GameCanvas = ({ onGoBack }) => {
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [targetLetter, setTargetLetter] = useState('');
    const [fish, setFish] = useState([]);

    // Audio setup
    const speak = useCallback((text) => {
        if (!window.speechSynthesis) return;

        // Cancel previous speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Attempt to pick a clear English voice, but fallback gracefully
        const voices = window.speechSynthesis.getVoices();
        // Prefer Google US English, then any US English, then any English
        const preferredVoice = voices.find(v => v.name.includes('Google US English')) ||
            voices.find(v => v.lang === 'en-US') ||
            voices.find(v => v.lang.startsWith('en'));

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.rate = 0.9;
        utterance.pitch = 1.1;

        // Chrome bug fix
        window.currentUtterance = utterance;
        utterance.onend = () => {
            window.currentUtterance = null;
        };
        utterance.onerror = (e) => {
            if (e.error === 'canceled' || e.error === 'interrupted') {
                return;
            }
            console.error(`Speech Error: ${e.error}`);
        };

        // Force resume
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        }

        window.speechSynthesis.speak(utterance);
    }, []);

    // Ensure voices are loaded
    useEffect(() => {
        // Some browsers need a little nudge
        window.speechSynthesis.getVoices();
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

        for (let i = 0; i < count; i++) {
            const char = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

            // Try to find a safe position
            let x, y;
            let valid = false;
            let attempts = 0;

            while (!valid && attempts < 50) {
                x = Math.random() * 80 + 10;
                y = Math.random() * 60 + 20;
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
            speak(`That is ${clickedFish.char}. Try finding ${targetLetter}`);
        }
    };

    const handleReplay = () => {
        speak(`Fish me ${targetLetter}`);
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <ScoreBoard score={score} totalAttempts={attempts} />

            {/* Target Letter Display */}
            {targetLetter && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
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
