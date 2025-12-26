import './GameHeader.css';

const GameHeader = ({ targetState, score, totalStates, attempts }) => {
    const accuracy = attempts > 0 ? Math.round((score / attempts) * 100) : 0;

    return (
        <div className="game-header">
            <div className="prompt-container">
                <h2 className="prompt-label">Find:</h2>
                <h1 className="target-state">{targetState || 'Loading...'}</h1>
            </div>

            <div className="stats-container">
                <div className="stat-box">
                    <div className="stat-value">{score}</div>
                    <div className="stat-label">Correct</div>
                </div>

                <div className="stat-divider"></div>

                <div className="stat-box">
                    <div className="stat-value">{totalStates}</div>
                    <div className="stat-label">Total</div>
                </div>

                <div className="stat-divider"></div>

                <div className="stat-box">
                    <div className="stat-value">{accuracy}%</div>
                    <div className="stat-label">Accuracy</div>
                </div>
            </div>
        </div>
    );
};

export default GameHeader;
