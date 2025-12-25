import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorldMap from './components/WorldMap';
import GameHeader from './components/GameHeader';
import { continentData } from './data/continents';
import { oceanData } from './data/oceans';
import { announceTarget, playCorrectSound, playWrongSound, playCelebrationSound } from './utils/audio';
import './styles.css';

function WorldMapGame() {
    const navigate = useNavigate();
    const [gamePhase, setGamePhase] = useState('continents'); // 'continents' or 'oceans'

    // Continent state
    const [targetCode, setTargetCode] = useState(null);
    const [remainingCodes, setRemainingCodes] = useState([]);
    const [correctNames, setCorrectNames] = useState([]);
    const [incorrectName, setIncorrectName] = useState(null);

    // Ocean state
    const [targetOceanCode, setTargetOceanCode] = useState(null);
    const [remainingOceanCodes, setRemainingOceanCodes] = useState([]);
    const [correctOceans, setCorrectOceans] = useState([]);
    const [incorrectOcean, setIncorrectOcean] = useState(null);

    const [score, setScore] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);

    const totalItems = Object.keys(continentData).length + Object.keys(oceanData).length;

    useEffect(() => {
        startNewGame();
    }, []);

    useEffect(() => {
        if (gamePhase === 'continents' && targetCode && !gameComplete) {
            const targetName = continentData[targetCode].name;
            const timer = setTimeout(() => announceTarget(targetName), 500);
            return () => clearTimeout(timer);
        } else if (gamePhase === 'oceans' && targetOceanCode && !gameComplete) {
            const targetName = oceanData[targetOceanCode].name;
            const timer = setTimeout(() => announceTarget(targetName), 500);
            return () => clearTimeout(timer);
        }
    }, [targetCode, targetOceanCode, gamePhase, gameComplete]);

    const shuffleArray = (arr) => {
        const codes = [...arr];
        for (let i = codes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [codes[i], codes[j]] = [codes[j], codes[i]];
        }
        return codes;
    };

    const startNewGame = () => {
        // Start with continents
        const continentCodes = shuffleArray(Object.keys(continentData));
        setRemainingCodes(continentCodes.slice(1));
        setTargetCode(continentCodes[0]);
        setCorrectNames([]);
        setIncorrectName(null);

        // Reset ocean state
        setTargetOceanCode(null);
        setRemainingOceanCodes([]);
        setCorrectOceans([]);
        setIncorrectOcean(null);

        setGamePhase('continents');
        setScore(0);
        setGameComplete(false);
    };

    const startOceanPhase = () => {
        const oceanCodes = shuffleArray(Object.keys(oceanData));
        setRemainingOceanCodes(oceanCodes.slice(1));
        setTargetOceanCode(oceanCodes[0]);
        setGamePhase('oceans');
    };

    const handleContinentClick = (clickedName) => {
        if (gameComplete || gamePhase !== 'continents') return;

        const targetName = continentData[targetCode].name;

        if (clickedName === targetName) {
            const newCorrectNames = [...correctNames, clickedName];
            setCorrectNames(newCorrectNames);
            setIncorrectName(null);
            setScore(score + 1);
            playCorrectSound();

            if (remainingCodes.length === 0) {
                // Continents done, start ocean phase
                setTargetCode(null);
                setTimeout(startOceanPhase, 500);
            } else {
                const nextCode = remainingCodes[0];
                setRemainingCodes(remainingCodes.slice(1));
                setTargetCode(nextCode);
            }
        } else {
            setIncorrectName(clickedName);
            playWrongSound();
            setTimeout(() => setIncorrectName(null), 500);
        }
    };

    const handleOceanClick = (clickedName) => {
        if (gameComplete || gamePhase !== 'oceans') return;

        const targetName = oceanData[targetOceanCode].name;

        if (clickedName === targetName) {
            const newCorrectOceans = [...correctOceans, clickedName];
            setCorrectOceans(newCorrectOceans);
            setIncorrectOcean(null);
            setScore(score + 1);
            playCorrectSound();

            if (remainingOceanCodes.length === 0) {
                // All done!
                setGameComplete(true);
                setTargetOceanCode(null);
                setTimeout(playCelebrationSound, 1000);
            } else {
                const nextCode = remainingOceanCodes[0];
                setRemainingOceanCodes(remainingOceanCodes.slice(1));
                setTargetOceanCode(nextCode);
            }
        } else {
            setIncorrectOcean(clickedName);
            playWrongSound();
            setTimeout(() => setIncorrectOcean(null), 500);
        }
    };

    const getCurrentTarget = () => {
        if (gamePhase === 'continents' && targetCode) {
            return continentData[targetCode].name;
        } else if (gamePhase === 'oceans' && targetOceanCode) {
            return oceanData[targetOceanCode].name;
        }
        return '';
    };

    return (
        <div className="app-container">
            <button onClick={() => navigate('/')} className="home-btn" style={{
                position: 'absolute', top: '20px', left: '20px', fontSize: '2rem',
                background: 'none', border: 'none', cursor: 'pointer', zIndex: 100
            }}>🏠</button>
            <GameHeader
                targetContinent={getCurrentTarget()}
                score={score}
                total={totalItems}
                isComplete={gameComplete}
                onReset={startNewGame}
            />
            {!gameComplete && (
                <WorldMap
                    targetContinent={targetCode ? continentData[targetCode].name : null}
                    onContinentClick={handleContinentClick}
                    correctContinents={correctNames}
                    incorrectContinent={incorrectName}
                    gamePhase={gamePhase}
                    targetOcean={targetOceanCode ? oceanData[targetOceanCode].name : null}
                    onOceanClick={handleOceanClick}
                    correctOceans={correctOceans}
                    incorrectOcean={incorrectOcean}
                />
            )}
        </div>
    );
}

export default WorldMapGame;
