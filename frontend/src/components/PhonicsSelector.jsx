import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const patterns = ['ch', 'sh', 'th', 'at', 'ig'];

const colors = ['#FF69B4', '#4facfe', '#ffc107', '#4caf50', '#9c27b0'];

export function PhonicsSelector({ onSelect }) {

    useEffect(() => {
        // Say instructions on mount
        const utterance = new SpeechSynthesisUtterance("Pick a sound!");
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }, []);

    const playSound = (text) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="card">
            <h2 style={{ marginBottom: '2rem', fontSize: '2.5rem', color: 'var(--primary)' }}>
                Pick a Sound! 🎵
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
                {patterns.map((p, i) => (
                    <motion.button
                        key={p}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            playSound(p);
                            onSelect(p);
                        }}
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            fontSize: '3rem',
                            background: colors[i % colors.length],
                            color: 'white',
                            border: 'none',
                            boxShadow: '0 8px 0 rgba(0,0,0,0.2)',
                            cursor: 'pointer'
                        }}
                    >
                        {p}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
