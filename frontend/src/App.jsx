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
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '3rem',
          background: 'linear-gradient(to right, var(--primary), var(--secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0
        }}>
          Interactive Phonics Explorer
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Learning to read, powered by AI</p>
      </header>

      {!selectedWord && <Dashboard />}

      <main>
        {!selectedWord ? (
          <div style={{ display: 'grid', gap: '2rem' }}>
            <PhonicsSelector
              selected={selectedPattern}
              onSelect={setSelectedPattern}
            />

            {selectedPattern && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h3>Words with '{selectedPattern}'</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {words.map((word) => (
                    <motion.button
                      key={word}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="btn"
                      style={{ background: 'var(--secondary)' }}
                      onClick={() => setSelectedWord(word)}
                    >
                      {word}
                    </motion.button>
                  ))}
                  {words.length === 0 && <p>Loading words...</p>}
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
