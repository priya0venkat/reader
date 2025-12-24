import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCanvas from './components/GameCanvas';
import StartScreen from './components/StartScreen';
import './styles.css';

function AlphabetFishing() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameMode, setGameMode] = useState('capital');
    const navigate = useNavigate();

    const handleStart = (mode) => {
        setGameMode(mode);
        setIsPlaying(true);
    };

    const handleGoBack = () => {
        if (isPlaying) {
            setIsPlaying(false);
        } else {
            navigate('/');
        }
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
            {/* Background Bubbles for Index CSS animation */}
            {[...Array(10)].map((_, i) => (
                <div
                    key={i}
                    className="bubble"
                    style={{
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 50 + 20}px`,
                        height: `${Math.random() * 50 + 20}px`,
                        animationDuration: `${Math.random() * 5 + 5}s`,
                        animationDelay: `${Math.random() * 5}s`
                    }}
                />
            ))}

            {isPlaying ? (
                <GameCanvas
                    onGoBack={handleGoBack}
                    gameMode={gameMode}
                />
            ) : (
                <StartScreen onStart={handleStart} onGoHome={() => navigate('/')} />
            )}
        </div>
    );
}

export default AlphabetFishing;
