import { useState } from 'react'
import PuzzleBoard from './components/PuzzleBoard'
import Menu from './components/Menu'
import SuccessScreen from './components/SuccessScreen'

function App() {
  const [gameState, setGameState] = useState('menu') // menu, playing, won
  const [image, setImage] = useState(null)
  const [difficulty, setDifficulty] = useState(3) // 3x3 default
  const [showBackground, setShowBackground] = useState(true)

  const startGame = (selectedImage, selectedDifficulty, selectedShowBackground) => {
    setImage(selectedImage)
    setDifficulty(selectedDifficulty)
    setShowBackground(selectedShowBackground)
    setGameState('playing')
  }

  const handleWin = () => {
    setGameState('won')
  }

  const resetGame = () => {
    setGameState('menu')
    setImage(null)
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white flex flex-col items-center justify-center overflow-hidden">
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

export default App
