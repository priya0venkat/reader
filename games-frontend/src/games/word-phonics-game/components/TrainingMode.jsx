import { useState } from 'react';
import { playPhonicsSound } from '../../../utils/audio';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function TrainingMode() {
    const [playingLetter, setPlayingLetter] = useState(null);

    const handleLetterClick = async (letter) => {
        setPlayingLetter(letter);
        await playPhonicsSound(letter);
        setPlayingLetter(null);
    };

    return (
        <div className="alphabet-grid">
            {ALPHABET.map((letter) => (
                <button
                    key={letter}
                    className={`letter-btn ${playingLetter === letter ? 'playing' : ''}`}
                    onClick={() => handleLetterClick(letter)}
                >
                    {letter}
                </button>
            ))}
        </div>
    );
}

export default TrainingMode;
