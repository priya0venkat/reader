import React from 'react';
import { motion } from 'framer-motion';

const patterns = ['ch', 'sh', 'th', 'ph', 'wh', 'ck', 'ng', 'qu'];

export function PhonicsSelector({ onSelect, selected }) {
    return (
        <div className="card">
            <h2 style={{ marginBottom: '1rem' }}>Choose a Pattern</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {patterns.map((p) => (
                    <motion.button
                        key={p}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(p)}
                        className={`btn ${selected === p ? '' : 'btn-secondary'}`}
                        style={{
                            minWidth: '60px',
                            justifyContent: 'center',
                            background: selected === p ? 'var(--primary)' : 'transparent'
                        }}
                    >
                        {p}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
