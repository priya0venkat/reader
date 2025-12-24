import './GameHeader.css';

const GameHeader = ({ targetContinent, score, total, isComplete, onReset }) => {
    // If complete, we might want to hide the map or just show this overlay. 
    // For now, rendering it inside the header div but using the complete-screen classes.
    // Ideally, App.jsx would handle this layout switch, but styling matching is the priority.

    if (isComplete) {
        return (
            <div className="complete-screen">
                <h2 className="complete-title">World Explorer!</h2>
                <div className="final-stats">
                    <div className="final-stat">
                        <span className="final-stat-value">7 Continents and 4 Oceans Found</span>
                    </div>
                </div>
                <p className="complete-message">
                    Congratulations! You've mastered the world map!
                </p>
                <button onClick={onReset} className="play-again-button">
                    Play Again
                </button>
            </div>
        );
    }

    return (
        <div className="game-header">
            <div className="prompt-container">
                <p className="prompt-label">Find this Continent</p>
                <h2 className="target-state">{targetContinent}</h2>
            </div>

            <div className="stats-container">
                <div className="stat-box">
                    <span className="stat-value">{score}</span>
                    <span className="stat-label">Found</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-box">
                    <span className="stat-value">{total - score}</span>
                    <span className="stat-label">Remaining</span>
                </div>
            </div>
        </div>
    );
};

export default GameHeader;
