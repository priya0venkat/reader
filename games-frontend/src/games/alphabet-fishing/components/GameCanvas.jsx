import React, { useState, useEffect, useCallback, useRef } from 'react';
import LetterFish from './LetterFish';
import ScoreBoard from './ScoreBoard';
import confetti from 'canvas-confetti';
import { initPiper, speakText, phonetizeSentence, playPhonicsSound } from '../../../utils/audio';
import trackingService from '../../../services/trackingService';

const ALPHABET_CAPS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const ALPHABET_SMALL = 'abcdefghijklmnopqrstuvwxyz'.split('');


const GameCanvas = ({ onGoBack, gameMode = 'capital', maxNumber = 10 }) => {
    const [score, setScore] = useState(0);

    const [attempts, setAttempts] = useState(0);
    const [targetLetter, setTargetLetter] = useState('');
    const [fish, setFish] = useState([]);
    const [audioStatus, setAudioStatus] = useState('Initializing Audio...');

    // Deck state
    const [deck, setDeck] = useState([]);
    const [gameComplete, setGameComplete] = useState(false);
    const [isDeckReady, setIsDeckReady] = useState(false);

    // Initialize Piper WASM
    useEffect(() => {
        initPiper((status) => {
            setAudioStatus(status);
        }).catch(err => {
            console.error("Audio init failed", err);
        });
    }, []);

    // Audio setup
    const speak = useCallback((text) => {
        const phoneticText = phonetizeSentence(text);
        speakText(phoneticText);
    }, []);

    // State to track timeouts for cleanup
    const timeoutsRef = useRef([]);
    const addTimeout = useCallback((callback, delay) => {
        const id = setTimeout(() => {
            callback();
            timeoutsRef.current = timeoutsRef.current.filter(t => t !== id);
        }, delay);
        timeoutsRef.current.push(id);
    }, []);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach(clearTimeout);
        };
    }, []);

    // Initialize/Reset Game Deck
    const initGame = useCallback(() => {
        let pool = [];
        if (gameMode === 'small') {
            pool = [...ALPHABET_SMALL];
        } else if (gameMode === 'number') {
            pool = Array.from({ length: maxNumber }, (_, i) => String(i + 1));
        } else {
            pool = [...ALPHABET_CAPS];
        }

        // Fisher-Yates Shuffle
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        // Initialize Tracking Session
        // We do this here to cover both initial load and "Play Again"
        const levelId = gameMode === 'number' ? `numbers-1-${maxNumber}` : `${gameMode}-letters`;
        trackingService.initSession('alphabet-fishing', levelId, gameMode);

        setDeck(pool);
        setScore(0);
        setAttempts(0);
        setGameComplete(false);
        setFish([]);
        setIsDeckReady(true);
    }, [gameMode, maxNumber]);

    // Update game when mode changes
    useEffect(() => {
        initGame();
    }, [initGame]);

    const spawnNextBatch = useCallback(() => {
        if (!isDeckReady || gameComplete) return;

        setDeck(prevDeck => {
            if (prevDeck.length === 0) return prevDeck;

            const batchSize = 6 + Math.floor(Math.random() * 3);
            const itemsToSpawn = prevDeck.slice(0, batchSize);
            const remainingDeck = prevDeck.slice(batchSize);

            // Generate spawn positions
            const newFish = [];
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const fishWidthPx = 120;
            const fishHeightPx = 100;
            const safeRightMargin = 5;
            const fishWidthPercent = (fishWidthPx / screenWidth) * 100;
            const maxX = 100 - safeRightMargin - fishWidthPercent;
            const minX = 5;
            const safeBottomMargin = 5;
            const fishHeightPercent = (fishHeightPx / screenHeight) * 100;
            const maxY = 100 - safeBottomMargin - fishHeightPercent;
            const minY = 25;

            const isSafePosition = (x, y, existingFish) => {
                for (const fish of existingFish) {
                    const dx = Math.abs(x - fish.x);
                    const dy = Math.abs(y - fish.y);
                    if (dx < 12 && dy < 15) return false;
                }
                return true;
            };

            itemsToSpawn.forEach((char, i) => {
                let x, y;
                let valid = false;
                let attempts = 0;
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
            });

            // Perform State methods OUTSIDE the updater if possible, 
            // but since we need 'remainingDeck' and 'newFish' derived from 'prevDeck',
            // we have to be careful. 
            // In React 18, we can trigger other state updates here safely as they will be batched.
            setFish(newFish);
            addTimeout(() => pickNewTarget(newFish, remainingDeck), 1000);

            return remainingDeck;
        });
    }, [isDeckReady, gameComplete, addTimeout]); // pickNewTarget dependency handled below

    const pickNewTarget = useCallback((currentFish, currentDeck) => {
        if (currentFish.length === 0) {
            // No fish left on screen.
            // Check if deck is empty
            if (!currentDeck || currentDeck.length === 0) {
                // GAME OVER
                setGameComplete(true);
                speak("Congratulations! You found all of them!");
                trackingService.saveSession();
                return;
            }
            // Else, spawn next batch
            addTimeout(spawnNextBatch, 1000);
            return;
        }

        const randomFish = currentFish[Math.floor(Math.random() * currentFish.length)];
        setTargetLetter(randomFish.char);
        // Use human phonics audio for letter pronunciation in alphabet modes
        const isLetterMode = gameMode === 'capital' || gameMode === 'small';
        if (isLetterMode) {
            speakText('Fish me').then(() => playPhonicsSound(randomFish.char));
        } else {
            speak(`Fish me ${randomFish.char}`);
        }
    }, [speak, addTimeout, spawnNextBatch]);

    // Initial Start of the first batch
    useEffect(() => {
        if (isDeckReady && !gameComplete && fish.length === 0 && deck.length > 0) {
            // Only run this once per init
            // We can check if we haven't started yet
            spawnNextBatch();
        }
    }, [isDeckReady, gameComplete, spawnNextBatch]); // Careful with deps


    const handleFishClick = (clickedFish) => {
        if (gameComplete) return;
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
                // Pass currentDeck so it knows if game is over eventually
                addTimeout(() => pickNewTarget(remainingFish, deck), 1500);
            } else {
                // Screen cleared
                speak("All cleared! Next round.");
                // Pass deck to know if we should spawn or end
                addTimeout(() => pickNewTarget([], deck), 2000);
            }

        } else {
            // Incorrect
            trackingService.trackInteraction(targetLetter, clickedFish.char, false);
            speak(`That is ${clickedFish.char}. Try finding ${targetLetter}`);
        }
    };

    const handleReplay = () => {
        const isLetterMode = gameMode === 'capital' || gameMode === 'small';
        if (isLetterMode) {
            speakText('Fish me').then(() => playPhonicsSound(targetLetter));
        } else {
            speak(`Fish me ${targetLetter}`);
        }
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

            {/* Game Complete Overlay */}
            {gameComplete && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(255,255,255,0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 200,
                    gap: '20px'
                }}>
                    <h1 style={{ fontSize: '3rem', color: '#2a9d8f' }}>🎉 Amazing! 🎉</h1>
                    <p style={{ fontSize: '1.5rem', color: '#555' }}>You caught all the fish!</p>
                    <div style={{ fontSize: '1.2rem', margin: '10px 0' }}>
                        Final Score: {score} / {attempts}
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <button
                            onClick={() => initGame()}
                            style={{
                                padding: '15px 30px',
                                fontSize: '1.5rem',
                                background: '#E63946',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                            }}
                        >
                            Play Again 🔄
                        </button>
                        <button
                            onClick={onGoBack}
                            style={{
                                padding: '15px 30px',
                                fontSize: '1.5rem',
                                background: '#457b9d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                            }}
                        >
                            Exit 🏠
                        </button>
                    </div>
                </div>
            )}

            {/* Target Letter Display - Moved down to avoid overlap with score/controls */}
            {targetLetter && !gameComplete && (
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
            {!gameComplete && (
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
            )}

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
