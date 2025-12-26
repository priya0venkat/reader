import { useState, useEffect } from 'react';
import FlashCard from './FlashCard';
import trackingService from '../../../services/trackingService';

function GameBoard({ bundle, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Init session
    trackingService.initSession('flash-cards', bundle.id);

    // Track first card
    if (bundle.cards[0]) {
      trackingService.trackInteraction(bundle.cards[0].word, 'view', true);
    }

    return () => {
      trackingService.saveSession();
    };
  }, [bundle.id]);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % bundle.cards.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + bundle.cards.length) % bundle.cards.length);
  };

  const shuffle = () => {
    // Suffle logic would go here, maybe re-sort cards prop copy
    setCurrentIndex(0);
  };

  const currentCard = bundle.cards[currentIndex];

  useEffect(() => {
    if (currentCard) {
      trackingService.trackInteraction(currentCard.word, 'view', true);
    }
  }, [currentIndex, currentCard]);

  return (
    <div className="game-board fade-in">
      <div className="controls-top">
        <button onClick={onBack} className="btn-secondary">← Back</button>
        <span>{currentIndex + 1} / {bundle.cards.length}</span>
      </div>

      <div className="card-area">
        <FlashCard
          key={currentCard.id} // Re-mount on change to reset flip state
          card={currentCard}
          mechanic={bundle.mechanic}
        />
      </div>

      <div className="controls-bottom">
        <button onClick={prevCard} className="btn-nav">Previous</button>
        <button onClick={nextCard} className="btn-nav">Next</button>
      </div>

      <style>{`
        .game-board {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }
        .controls-top {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text-muted);
        }
        .btn-secondary {
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          font-weight: bold;
        }
        .btn-secondary:hover {
          color: var(--text);
          background: rgba(255,255,255,0.1);
        }
        .card-area {
          perspective: 1000px;
          margin: 2rem 0;
        }
        .controls-bottom {
          display: flex;
          gap: 1rem;
        }
        .btn-nav {
          background: var(--secondary);
          color: #fff;
          padding: 1rem 2rem;
          border-radius: var(--radius-md);
          font-size: 1.2rem;
          font-weight: bold;
          box-shadow: var(--shadow-md);
          transition: background 0.2s;
        }
        .btn-nav:hover {
          background: var(--secondary-hover);
        }
      `}</style>
    </div>
  );
}

export default GameBoard;
