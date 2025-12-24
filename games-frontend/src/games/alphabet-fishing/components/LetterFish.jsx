import React, { useEffect, useState } from 'react';

const LetterFish = ({ letter, onClick, position }) => {
    // Random bubble movement
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            setOffset({
                x: Math.random() * 20 - 10,
                y: Math.random() * 20 - 10
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            onClick={() => onClick(letter)}
            style={{
                position: 'absolute',
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: `translate(${offset.x}px, ${offset.y}px)`,
                transition: 'transform 2s ease-in-out',
                cursor: 'pointer',
                width: '100px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))'
            }}
        >
            {/* Fish Shape SVG */}
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 80"
                style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
            >
                {/* Simple Fish Body */}
                <path
                    d="M85,40 Q85,10 60,10 Q30,10 10,40 Q30,70 60,70 Q85,70 85,40 Z M85,40 L95,20 L95,60 Z"
                    fill="rgba(255, 255, 255, 0.25)"
                    stroke="rgba(255, 255, 255, 0.6)"
                    strokeWidth="3"
                />
                {/* Eye */}
                <circle cx="30" cy="30" r="3" fill="white" />
            </svg>

            <span style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '0 0 5px rgba(0,0,0,0.5)',
                zIndex: 1,
                paddingLeft: '10px' // Offset text slightly away from tail
            }}>
                {letter}
            </span>
        </div>
    );
};

export default LetterFish;
