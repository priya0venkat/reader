import { countriesData } from '../data/countries';
import './USMap.css';

const NorthAmericaMap = ({ targetState, onStateClick, correctStates, incorrectState }) => {
    const handleCountryClick = (countryName) => {
        onStateClick(countryName);
    };

    return (
        <div className="map-container">
            <svg
                viewBox="0 0 1000 800"
                className="us-map"
                xmlns="http://www.w3.org/2000/svg"
            >
                {Object.entries(countriesData).map(([countryName, countryInfo]) => {
                    const isCorrect = correctStates.includes(countryName);
                    const isIncorrect = incorrectState === countryName;
                    const isTarget = targetState === countryName;

                    return (
                        <path
                            key={countryName}
                            d={countryInfo.path}
                            className={`state ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''} ${isTarget ? 'target' : ''}`}
                            onClick={() => handleCountryClick(countryName)}
                            data-name={countryName}
                            style={{
                                fill: isCorrect ? '#4caf50' : isIncorrect ? '#f44336' : countryInfo.color,
                                stroke: '#ffffff',
                                strokeWidth: '0.5px'
                            }}
                        >
                            <title>{countryName}</title>
                        </path>
                    );
                })}
                {Object.entries(countriesData).map(([countryName, countryInfo]) => {
                    if (!countryInfo.labelX || !countryInfo.labelY) return null;
                    return (
                        <g key={`label-group-${countryName}`} style={{ pointerEvents: 'none' }}>
                            {countryInfo.code && (
                                <image
                                    href={`https://flagcdn.com/${countryInfo.code}.svg`}
                                    x={countryInfo.labelX - 45}
                                    y={countryInfo.labelY + 5}
                                    className="country-flag"
                                />
                            )}
                            <text
                                x={countryInfo.labelX}
                                y={countryInfo.code ? countryInfo.labelY - 12 : countryInfo.labelY}
                                className="country-label"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {countryInfo.id}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default NorthAmericaMap;
