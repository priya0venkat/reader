import { useState, useRef } from 'react';
import { playPhonicsSound, speakText } from '../../../utils/audio';

function QuizMode() {
    const [word, setWord] = useState('');
    const [displayedWord, setDisplayedWord] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingIndex, setPlayingIndex] = useState(-1);
    const isPlayingRef = useRef(false);

    const handleInputChange = (e) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
        setWord(value);
    };

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handlePlay = async () => {
        if (!word || isPlaying) return;

        setIsPlaying(true);
        isPlayingRef.current = true;
        setDisplayedWord(word);

        // Play each letter's phonic sound
        for (let i = 0; i < word.length; i++) {
            if (!isPlayingRef.current) break;

            setActiveIndex(i);
            await playPhonicsSound(word[i]);
            await sleep(300); // Short pause between letters
        }

        // Say the whole word
        if (isPlayingRef.current) {
            setActiveIndex(-1);
            await sleep(500);
            await speakText(word);
        }

        setActiveIndex(-1);
        setIsPlaying(false);
        isPlayingRef.current = false;
    };

    const handleLetterClick = async (letter, index) => {
        if (isPlaying) return;

        setPlayingIndex(index);
        await playPhonicsSound(letter);
        setPlayingIndex(-1);
    };

    const handleClear = () => {
        isPlayingRef.current = false;
        setIsPlaying(false);
        setWord('');
        setDisplayedWord('');
        setActiveIndex(-1);
        setPlayingIndex(-1);
    };

    return (
        <div className="quiz-mode">
            <div className="word-input-container">
                <input
                    type="text"
                    className="word-input"
                    value={word}
                    onChange={handleInputChange}
                    placeholder="Type a word..."
                    disabled={isPlaying}
                    maxLength={12}
                />
                <button
                    className="play-btn"
                    onClick={handlePlay}
                    disabled={!word || isPlaying}
                >
                    {isPlaying ? '🔊 Playing...' : '▶️ Play'}
                </button>
                <button className="clear-btn" onClick={handleClear}>
                    🗑️ Clear
                </button>
            </div>

            {displayedWord && (
                <div className="word-display">
                    {displayedWord.split('').map((letter, index) => (
                        <span
                            key={index}
                            className={`display-letter ${activeIndex === index ? 'active' : ''
                                } ${playingIndex === index ? 'playing' : ''}`}
                            onClick={() => handleLetterClick(letter, index)}
                        >
                            {letter}
                        </span>
                    ))}
                </div>
            )}

            <p className="instructions">
                {displayedWord
                    ? 'Tap any letter to hear its sound!'
                    : 'Type a word and press Play to hear its sounds'}
            </p>
        </div>
    );
}

export default QuizMode;
