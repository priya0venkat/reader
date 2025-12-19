import React from 'react';

function Feedback({ isCorrect }) {
    return (
        <div className={`feedback ${isCorrect ? 'correct' : 'wrong'}`}>
            <div className="feedback-emoji">
                {isCorrect ? '🎉' : '😅'}
            </div>
            <div className="feedback-text">
                {isCorrect ? 'Great job!' : 'Try again!'}
            </div>
        </div>
    );
}

export default Feedback;
