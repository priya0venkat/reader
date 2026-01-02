import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrainingMode from './components/TrainingMode';
import QuizMode from './components/QuizMode';
import './styles.css';

function WordPhonicsGame() {
    const navigate = useNavigate();
    const [mode, setMode] = useState('training'); // 'training' or 'quiz'

    return (
        <div className="word-phonics-game">
            <header className="game-header">
                <button onClick={() => navigate('/')} className="home-btn">
                    🏠
                </button>
                <h1>🔊 Word Phonics 🔊</h1>
            </header>

            <div className="mode-selector">
                <button
                    className={`mode-btn ${mode === 'training' ? 'active' : ''}`}
                    onClick={() => setMode('training')}
                >
                    📚 Training
                </button>
                <button
                    className={`mode-btn ${mode === 'quiz' ? 'active' : ''}`}
                    onClick={() => setMode('quiz')}
                >
                    ✏️ Quiz
                </button>
            </div>

            {mode === 'training' ? <TrainingMode /> : <QuizMode />}
        </div>
    );
}

export default WordPhonicsGame;
