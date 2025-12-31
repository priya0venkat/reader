import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import './styles.css';
import trackingService from '../../services/trackingService';

const TREATS = [
    { id: 'apple', emoji: '🍎', name: 'Apple' },
    { id: 'cookie', emoji: '🍪', name: 'Cookie' },
    { id: 'chocolate', emoji: '🍫', name: 'Chocolate' },
    { id: 'strawberry', emoji: '🍓', name: 'Strawberry' },
    { id: 'pizza', emoji: '🍕', name: 'Pizza' },
    { id: 'donut', emoji: '🍩', name: 'Donut' },
    { id: 'icecream', emoji: '🍦', name: 'Ice Cream' },
    { id: 'cake', emoji: '🍰', name: 'Cake' },
];

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

function CountingGame() {
    const navigate = useNavigate();
    const [maxNumber, setMaxNumber] = useState(10);
    const [targetNumber, setTargetNumber] = useState(1);
    const [currentTreat, setCurrentTreat] = useState(TREATS[0]);
    const [itemsOnPlate, setItemsOnPlate] = useState([]);
    const [options, setOptions] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [wrongOption, setWrongOption] = useState(null);

    const [hasStarted, setHasStarted] = useState(false);
    const [voice, setVoice] = useState(null);

    // Shuffled sequence of numbers and current index
    const [shuffledNumbers, setShuffledNumbers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);

    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            const enVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
            setVoice(enVoice);
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const speak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (voice) utterance.voice = voice;
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        utterance.onerror = (e) => console.error("Speech Error:", e);
        window.speechSynthesis.speak(utterance);
    };

    const startGame = () => {
        setHasStarted(true);
        setGameComplete(false);
        speak("Let's go!");
        // Initialize tracking
        trackingService.initSession('counting-game', `max-${maxNumber}`);

        // Create shuffled list of numbers 1 to maxNumber
        const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
        const shuffled = shuffleArray(numbers);
        setShuffledNumbers(shuffled);
        setCurrentIndex(0);

        // Start with the first number in the shuffled list
        startNewLevelWithNumber(shuffled[0]);
    };

    const generateOptions = (target) => {
        const opts = new Set([target]);
        while (opts.size < 3) {
            let num = Math.floor(Math.random() * maxNumber) + 1;
            if (num !== target) {
                opts.add(num);
            }
        }
        return Array.from(opts).sort(() => Math.random() - 0.5);
    };

    const startNewLevelWithNumber = (newTarget) => {
        const randomTreat = TREATS[Math.floor(Math.random() * TREATS.length)];
        const newOptions = generateOptions(newTarget);

        setTargetNumber(newTarget);
        setCurrentTreat(randomTreat);
        setOptions(newOptions);
        setShowSuccess(false);
        setWrongOption(null);

        const newItems = Array.from({ length: newTarget }, (_, i) => ({
            id: Date.now() + i,
            x: 35 * Math.sqrt(i + 1) * Math.cos(i * 2.39996),
            y: 35 * Math.sqrt(i + 1) * Math.sin(i * 2.39996),
        }));
        setItemsOnPlate(newItems);

        setTimeout(() => {
            speak(`Let's eat ${randomTreat.name}s!`);
        }, 500);
    };

    const advanceToNextLevel = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= shuffledNumbers.length) {
            // Game complete!
            setGameComplete(true);
            trackingService.saveSession();
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.5 }
            });
            speak("Congratulations! You counted all the numbers! Great job!");
        } else {
            setCurrentIndex(nextIndex);
            startNewLevelWithNumber(shuffledNumbers[nextIndex]);
        }
    };

    const handleItemClick = (id) => {
        if (showSuccess) return;
        playPopSound();
        setItemsOnPlate(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handleOptionClick = (number) => {
        if (showSuccess) return;

        if (number === targetNumber) {
            trackingService.trackInteraction(targetNumber.toString(), number.toString(), true);
            handleWin(number);
        } else {
            trackingService.trackInteraction(targetNumber.toString(), number.toString(), false);
            setWrongOption(number);
            playErrorSound();
            setTimeout(() => setWrongOption(null), 500);
        }
    };

    const handleWin = (finalCount) => {
        setShowSuccess(true);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        playSuccessSound();

        setTimeout(() => {
            speak(`That is right! There were ${finalCount} ${currentTreat.name}s!`);
        }, 1000);

        setTimeout(advanceToNextLevel, 5000);
    };

    const playPopSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.play().catch(e => console.log('Audio play failed', e));
    };

    const playSuccessSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
        audio.play().catch(e => console.log('Audio play failed', e));
    };

    const playErrorSound = () => {
        // Visual shake handles error feedback
    };

    return (
        <div className="game-container">
            <header>
                <button onClick={() => { trackingService.saveSession(); navigate('/'); }} className="home-btn">🏠</button>
                <h1>How many {currentTreat.name}s?</h1>
                {hasStarted && !gameComplete && (
                    <span style={{
                        position: 'absolute',
                        right: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '1.2rem',
                        color: '#ffcc00',
                        fontWeight: 'bold'
                    }}>
                        {currentIndex + 1}/{maxNumber}
                    </span>
                )}
            </header>

            {!hasStarted && (
                <div className="start-overlay">
                    <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>Counting Game</h1>

                    <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <label style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ffcc00' }}>
                            Maximum Number: {maxNumber}
                        </label>
                        <input
                            type="range"
                            min="5"
                            max="30"
                            value={maxNumber}
                            onChange={(e) => setMaxNumber(parseInt(e.target.value))}
                            style={{ width: '300px', cursor: 'pointer' }}
                        />
                    </div>

                    <button onClick={startGame} className="start-button">
                        Start Playing ▶️
                    </button>
                </div>
            )}

            <main>
                <div className="plate-area">
                    <div className={`plate ${showSuccess ? 'success' : ''}`}>
                        <AnimatePresence>
                            {itemsOnPlate.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    whileHover={{ scale: 1.2, cursor: 'pointer' }}
                                    whileTap={{ scale: 0.9 }}
                                    className="plate-item"
                                    onClick={() => handleItemClick(item.id)}
                                    style={{
                                        fontSize: '4rem',
                                        position: 'absolute',
                                        left: `calc(50% + ${item.x}px)`,
                                        top: `calc(50% + ${item.y}px)`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                >
                                    {currentTreat.emoji}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="options-container">
                    {options.map((number) => (
                        <motion.button
                            key={number}
                            className={`option-button ${wrongOption === number ? 'shake' : ''}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOptionClick(number)}
                            animate={wrongOption === number ? { x: [-10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.4 }}
                        >
                            {number}
                        </motion.button>
                    ))}
                </div>
            </main>

            {showSuccess && !gameComplete && (
                <motion.div
                    className="success-message"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Correct! That's {targetNumber}! 🎉</h2>
                </motion.div>
            )}

            {gameComplete && (
                <motion.div
                    className="start-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉 Game Complete! 🎉</h1>
                    <p style={{ fontSize: '2rem', marginBottom: '2rem', color: '#ffcc00' }}>
                        You counted all {maxNumber} numbers!
                    </p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <button onClick={() => { setHasStarted(false); setGameComplete(false); }} className="start-button">
                            Play Again 🔄
                        </button>
                        <button onClick={() => { trackingService.saveSession(); navigate('/'); }} className="start-button" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            Exit 🏠
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default CountingGame;
