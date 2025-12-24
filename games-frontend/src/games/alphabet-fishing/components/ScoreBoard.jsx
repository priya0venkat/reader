import React from 'react';

const ScoreBoard = ({ score, totalAttempts }) => {
    const accuracy = totalAttempts > 0
        ? Math.round((score / totalAttempts) * 100)
        : 100;

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '10px 20px',
            borderRadius: '15px',
            display: 'flex',
            gap: '20px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#333',
            zIndex: 100,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
            <div>Score: {score}</div>
            <div>Accuracy: {accuracy}%</div>
        </div>
    );
};

export default ScoreBoard;
