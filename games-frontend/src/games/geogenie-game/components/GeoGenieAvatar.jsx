// GeoGenie Avatar Component
// Animated globe character for the AI tutor

import React, { useState, useEffect } from 'react';
import './GeoGenieAvatar.css';

const GeoGenieAvatar = ({
    state = 'idle', // 'idle', 'thinking', 'speaking', 'celebrating'
    onClick,
    size = 'medium' // 'small', 'medium', 'large'
}) => {
    const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });

    // Subtle eye movement animation
    useEffect(() => {
        const interval = setInterval(() => {
            if (state === 'idle') {
                setEyePosition({
                    x: (Math.random() - 0.5) * 4,
                    y: (Math.random() - 0.5) * 2
                });
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [state]);

    const sizeClass = {
        small: 'avatar-small',
        medium: 'avatar-medium',
        large: 'avatar-large'
    }[size] || 'avatar-medium';

    return (
        <div
            className={`geogenie-avatar ${sizeClass} ${state}`}
            onClick={onClick}
            role="button"
            aria-label="GeoGenie Geography Tutor"
        >
            {/* Globe body */}
            <div className="avatar-body">
                {/* Continents (simplified) */}
                <div className="continent continent-1" />
                <div className="continent continent-2" />
                <div className="continent continent-3" />

                {/* Face */}
                <div className="avatar-face">
                    {/* Eyes */}
                    <div className="eye left-eye">
                        <div
                            className="pupil"
                            style={{
                                transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`
                            }}
                        />
                    </div>
                    <div className="eye right-eye">
                        <div
                            className="pupil"
                            style={{
                                transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`
                            }}
                        />
                    </div>

                    {/* Mouth - changes based on state */}
                    <div className={`mouth ${state === 'speaking' ? 'mouth-open' : ''}`}>
                        {state === 'speaking' && (
                            <div className="mouth-inner" />
                        )}
                    </div>

                    {/* Blush cheeks */}
                    <div className="blush left-blush" />
                    <div className="blush right-blush" />
                </div>

                {/* Thinking indicator */}
                {state === 'thinking' && (
                    <div className="thinking-dots">
                        <span className="dot dot-1" />
                        <span className="dot dot-2" />
                        <span className="dot dot-3" />
                    </div>
                )}

                {/* Celebration sparkles */}
                {state === 'celebrating' && (
                    <div className="sparkles">
                        <span className="sparkle sparkle-1">✨</span>
                        <span className="sparkle sparkle-2">⭐</span>
                        <span className="sparkle sparkle-3">✨</span>
                    </div>
                )}
            </div>

            {/* Name label */}
            <div className="avatar-name">GeoGenie</div>
        </div>
    );
};

export default GeoGenieAvatar;
