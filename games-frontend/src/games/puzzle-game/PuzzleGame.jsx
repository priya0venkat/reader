import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PuzzleBoard from './components/PuzzleBoard'
import Menu from './components/Menu'
import SuccessScreen from './components/SuccessScreen'
import trackingService from '../../services/trackingService'
import './styles.css'

function PuzzleGame() {
    const navigate = useNavigate()
    const [gameState, setGameState] = useState('menu')
    const [image, setImage] = useState(null)
    const [difficulty, setDifficulty] = useState(3)
    const [showBackground, setShowBackground] = useState(true)

    const startGame = (selectedImage, selectedDifficulty, selectedShowBackground) => {
        setImage(selectedImage)
        setDifficulty(selectedDifficulty)
        setShowBackground(selectedShowBackground)
        setGameState('playing')
        trackingService.initSession('puzzle-game', `diff-${selectedDifficulty}`);
    }

    const handleWin = () => {
        setGameState('won')
    }

    const resetGame = () => {
        trackingService.saveSession()
        setGameState('menu')
        setImage(null)
    }

    return (
        <div className="puzzle-container">
            <button onClick={() => { trackingService.saveSession(); navigate('/'); }} className="home-btn">🏠</button>
            {gameState === 'menu' && <Menu onStart={startGame} />}
            {gameState === 'playing' && (
                <PuzzleBoard
                    image={image}
                    difficulty={difficulty}
                    showBackground={showBackground}
                    onWin={handleWin}
                />
            )}
            {gameState === 'won' && <SuccessScreen onReset={resetGame} image={image} />}
        </div>
    )
}

export default PuzzleGame
