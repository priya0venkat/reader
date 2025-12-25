import { statesData } from '../data/states';
import { centroids } from '../data/centroids';
import './USMap.css';

const USMap = ({ targetState, onStateClick, correctStates, incorrectState }) => {
    const handleStateClick = (stateName) => {
        onStateClick(stateName);
    };

    return (
        <div className="map-container">
            <svg
                viewBox="0 0 960 600"
                className="us-map"
                xmlns="http://www.w3.org/2000/svg"
            >
                {Object.entries(statesData).map(([stateName, stateInfo]) => {
                    const isCorrect = correctStates.includes(stateName);
                    const isIncorrect = incorrectState === stateName;
                    const isTarget = targetState === stateName;

                    return (
                        <path
                            key={stateName}
                            d={stateInfo.path}
                            className={`state ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''} ${isTarget ? 'target' : ''}`}
                            onClick={() => handleStateClick(stateName)}
                            data-state={stateName}
                            style={{
                                fill: isCorrect ? '#4caf50' : isIncorrect ? '#f44336' : stateInfo.color
                            }}
                        >
                            <title>{stateName}</title>
                        </path>
                    );
                })}
                {Object.entries(centroids).map(([stateName, coords]) => (
                    <text
                        key={`label-${stateName}`}
                        x={coords.x}
                        y={coords.y}
                        className="state-label"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        style={{
                            pointerEvents: 'none',
                            fontSize: '14px',
                            fill: '#ffffff',
                            textShadow: '0px 0px 3px #000000, 0px 0px 3px #000000',
                            fontWeight: '900',
                            userSelect: 'none',
                            fontFamily: 'sans-serif'
                        }}
                    >
                        {statesData[stateName]?.id || stateName}
                    </text>
                ))}
            </svg>
        </div>
    );
};

export default USMap;
