import { continentData } from '../data/continents';
import { oceanData } from '../data/oceans';
import './WorldMap.css';

const WorldMap = ({
    targetContinent,
    onContinentClick,
    correctContinents,
    incorrectContinent,
    gamePhase = 'continents',
    targetOcean,
    onOceanClick,
    correctOceans = [],
    incorrectOcean
}) => {
    const isOceanPhase = gamePhase === 'oceans';

    return (
        <div className="map-container">
            <svg
                viewBox="0 0 700 340"
                className="world-map"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Water background */}
                <rect x="0" y="0" width="700" height="340" fill="#87CEEB" />
                {/* Border */}
                <rect x="0" y="0" width="700" height="340" fill="none" stroke="#2c3e50" strokeWidth="4" />
                {/* Render continents */}
                {Object.entries(continentData).map(([code, data]) => {
                    const isCorrect = correctContinents.includes(data.name);
                    const isIncorrect = incorrectContinent === data.name;
                    const isTarget = targetContinent === data.name;

                    return (
                        <g
                            key={code}
                            id={code}
                            className={`continent ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''} ${isTarget ? 'target' : ''} ${isOceanPhase ? 'ocean-phase' : ''}`}
                            onClick={() => !isOceanPhase && onContinentClick(data.name)}
                            style={{ cursor: isOceanPhase ? 'default' : 'pointer' }}
                        >
                            {data.paths.map((pathData, index) => {
                                return pathData.trim().match(/^[Mm]/) ? (
                                    <path key={index} d={pathData} />
                                ) : null;
                            })}
                        </g>
                    );
                })}

                {/* Render oceans with labels and clickable areas */}
                {Object.entries(oceanData).map(([code, data]) => {
                    const isCorrect = correctOceans.includes(data.name);
                    const isIncorrect = incorrectOcean === data.name;
                    const isTarget = targetOcean === data.name;
                    const { clickArea, labelPosition } = data;

                    return (
                        <g key={code} className="ocean-group">
                            {/* Clickable area (semi-transparent rectangle) */}
                            {isOceanPhase && (
                                <rect
                                    x={clickArea.x}
                                    y={clickArea.y}
                                    width={clickArea.width}
                                    height={clickArea.height}
                                    className={`ocean-click-area ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''} ${isTarget ? 'target' : ''}`}
                                    onClick={() => onOceanClick && onOceanClick(data.name)}
                                />
                            )}
                            {/* Ocean label */}
                            <text
                                x={labelPosition.x}
                                y={labelPosition.y}
                                className={`ocean-label ${isCorrect ? 'correct' : ''} ${isOceanPhase ? 'active' : ''}`}
                                textAnchor="middle"
                                onClick={() => isOceanPhase && onOceanClick && onOceanClick(data.name)}
                            >
                                {isCorrect ? data.name : (isOceanPhase ? '?' : '')}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default WorldMap;
