import { useState } from 'react';
import { speakText } from '../utils/audio';

function FlashCard({ card, mechanic }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (!isFlipped) {
      speakText(card.phonetic || card.back);
    }
    setIsFlipped(!isFlipped);
  };

  const isImageReveal = mechanic === 'image-reveal';

  return (
    <div className={`flash-card ${isFlipped ? 'flipped' : ''}`} onClick={handleClick}>
      <div className="flash-card-inner">
        <div className="flash-card-front">
          {isImageReveal ? (
            card.front.startsWith('/') ? (
              <img src={card.front} alt="Guess the object" />
            ) : (
              <div className="emoji-content">{card.front}</div>
            )
          ) : (
            <div className="text-content">{card.front}</div>
          )}
          {isImageReveal && <p className="hint">Tap to reveal!</p>}
        </div>
        <div className="flash-card-back">
          <div className="text-content">{card.back}</div>
        </div>
      </div>

      <style>{`
        .flash-card {
          width: 300px;
          height: 400px;
          cursor: pointer;
          background-color: transparent;
        }
        .flash-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          box-shadow: var(--shadow-lg);
          border-radius: var(--radius-lg);
        }
        .flash-card.flipped .flash-card-inner {
          transform: rotateY(180deg);
        }
        .flash-card-front, .flash-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: var(--radius-lg);
          background: var(--surface);
          color: var(--text);
          padding: 2rem;
          border: 4px solid var(--secondary);
        }
        .flash-card-front {
          /* Default front style */
        }
        .flash-card-back {
          background: var(--primary);
          color: white;
          transform: rotateY(180deg);
        }
        .flash-card img {
          max-width: 80%;
          max-height: 60%;
          object-fit: contain;
          margin-bottom: 1rem;
        }
        .text-content {
          font-size: 3rem;
          font-weight: bold;
        }
        .emoji-content {
          font-size: 8rem;
          line-height: 1;
        }
        .hint {
          margin-top: 1rem;
          font-size: 1rem;
          color: var(--text-muted);
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}

export default FlashCard;
