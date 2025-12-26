import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BundleSelector from './components/BundleSelector';
import GameBoard from './components/GameBoard';
import { initPiper, unlockAudioContext } from './utils/audio';
import trackingService from '../../services/trackingService';
import './styles.css';
import './base.css';

function FlashCardGame() {
    const navigate = useNavigate();
    const [currentBundle, setCurrentBundle] = useState(null);
    const [audioStatus, setAudioStatus] = useState('');

    useEffect(() => {
        const handleInteraction = () => {
            unlockAudioContext();
            initPiper((status) => setAudioStatus(status));
            window.removeEventListener('click', handleInteraction);
        };
        window.addEventListener('click', handleInteraction);
        return () => window.removeEventListener('click', handleInteraction);
    }, []);

    return (
        <div className="app-container">
            <header className="app-header">
                <button onClick={() => navigate('/')} className="home-btn">🏠</button>
                <h1 onClick={() => setCurrentBundle(null)} style={{ cursor: 'pointer' }}>
                    ✨ Flash Cards ✨
                </h1>
                {audioStatus && <div className="audio-status">{audioStatus}</div>}
            </header>
            <style>{`
        .home-btn {
          position: absolute;
          left: 1rem;
          top: 1rem;
          font-size: 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
        }
        .audio-status {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 0.8rem;
          opacity: 0.7;
        }
      `}</style>

            <main>
                {currentBundle ? (
                    <GameBoard
                        bundle={currentBundle}
                        onBack={() => setCurrentBundle(null)}
                    />
                ) : (
                    <BundleSelector onSelectBundle={setCurrentBundle} />
                )}
            </main>
        </div>
    );
}

export default FlashCardGame;
