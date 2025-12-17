import React, { useState, useEffect } from 'react';
import { PhonicsSelector } from './components/PhonicsSelector';
import { Reader } from './components/Reader';
import { Dashboard } from './components/Dashboard';
import axios from 'axios';
import { motion } from 'framer-motion';

function App() {
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);

  useEffect(() => {
    if (selectedPattern) {
      fetchWords(selectedPattern);
      setSelectedWord(null);
    }
  }, [selectedPattern]);

  const fetchWords = async (pattern) => {
    try {
      const res = await axios.get(`http://localhost:8000/words?pattern=${pattern}`);
      setWords(res.data.words);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '4rem',
          color: 'var(--primary)',
          margin: 0,
          textShadow: '3px 3px 0px #ffd1ff'
        }}>
          Phonics Fun! 🎈
        </h1>
      </header>

      {!selectedWord && !selectedPattern && <Dashboard />}

      <main>
        {!selectedWord ? (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {!selectedPattern ? (
              <PhonicsSelector onSelect={setSelectedPattern} />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card"
              >
                <button
                  className="btn-secondary"
                  onClick={() => setSelectedPattern(null)}
                  style={{ marginBottom: '1rem' }}
                >
                  &larr; Back
                </button>

                <h2 style={{ fontSize: '2.5rem', color: 'var(--text)' }}>
                  Start with '{selectedPattern}'
                </h2>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {(words || []).map((word) => (
                    <motion.button
                      key={word}
                      whileHover={{ scale: 1.1, rotate: -3 }}
                      whileTap={{ scale: 0.9 }}
                      className="btn"
                      style={{ background: 'var(--secondary)', fontSize: '2rem' }}
                      onClick={() => setSelectedWord(word)}
                    >
                      {word}
                    </motion.button>
                  ))}
                  {(!words || words.length === 0) && <p style={{ fontSize: '1.5rem' }}>Loading words...</p>}
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <Reader
            word={selectedWord}
            onBack={() => setSelectedWord(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
