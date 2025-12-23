import { useState, useEffect } from 'react';
import './index.css';
import BundleSelector from './components/BundleSelector';
import GameBoard from './components/GameBoard';
import { initPiper, unlockAudioContext } from './utils/audio';

function App() {
  const [currentBundle, setCurrentBundle] = useState(null);
  const [audioStatus, setAudioStatus] = useState('');

  useEffect(() => {
    const handleInteraction = () => {
      unlockAudioContext();
      initPiper((status) => setAudioStatus(status));
      // Remove listener after first interaction
      window.removeEventListener('click', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 onClick={() => setCurrentBundle(null)} style={{ cursor: 'pointer' }}>
          ✨ Flash Cards ✨
        </h1>
        {audioStatus && <div className="audio-status">{audioStatus}</div>}
      </header>
      <style>{`
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

export default App;
