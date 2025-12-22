import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import StartScreen from './components/StartScreen';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

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
        <GameCanvas onGoBack={() => setIsPlaying(false)} />
      ) : (
        <StartScreen onStart={() => setIsPlaying(true)} />
      )}
    </div>
  );
}

export default App;
