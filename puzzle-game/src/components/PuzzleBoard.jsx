import { useState, useEffect, useRef } from 'react'
import PuzzlePiece from './PuzzlePiece'
import { playSnap, playWin } from '../utils/sound'
import clsx from 'clsx'

export default function PuzzleBoard({ image, difficulty, showBackground, onWin }) {
    const [pieces, setPieces] = useState([])
    const [boardDimensions, setBoardDimensions] = useState({ width: 0, height: 0, top: 0, left: 0 })
    const [loaded, setLoaded] = useState(false)

    const containerRef = useRef(null)

    useEffect(() => {
        // Determine board size based on viewport and image aspect ratio
        const img = new Image()
        img.src = image
        img.onload = () => {
            const isLandscape = window.innerWidth > window.innerHeight

            // Adjust max dimensions based on orientation
            const maxWidth = window.innerWidth * (isLandscape ? 0.6 : 0.9) // Use less width in landscape to leave side space for pieces
            const maxHeight = window.innerHeight * (isLandscape ? 0.9 : 0.65) // Use more height in landscape, less in portrait

            const aspect = img.width / img.height
            let width = maxWidth
            let height = width / aspect

            if (height > maxHeight) {
                height = maxHeight
                width = height * aspect
            }

            // Center the board
            const top = (window.innerHeight - height) / 2
            const left = (window.innerWidth - width) / 2

            setBoardDimensions({ width, height, top, left })

            // Generate edge connections
            // shape[row][col] = { top, right, bottom, left }
            const shapes = Array(difficulty).fill(0).map(() => Array(difficulty).fill(0).map(() => ({ top: 0, right: 0, bottom: 0, left: 0 })))

            // Horizontal edges (rows x cols-1)
            for (let r = 0; r < difficulty; r++) {
                for (let c = 0; c < difficulty - 1; c++) {
                    const type = Math.random() > 0.5 ? 1 : -1
                    shapes[r][c].right = type
                    shapes[r][c + 1].left = -type
                }
            }

            // Vertical edges (rows-1 x cols)
            for (let r = 0; r < difficulty - 1; r++) {
                for (let c = 0; c < difficulty; c++) {
                    const type = Math.random() > 0.5 ? 1 : -1
                    shapes[r][c].bottom = type
                    shapes[r + 1][c].top = -type
                }
            }

            // Generate pieces
            const newPieces = []
            const pieceW = width / difficulty
            const pieceH = height / difficulty

            for (let row = 0; row < difficulty; row++) {
                for (let col = 0; col < difficulty; col++) {
                    newPieces.push({
                        id: `${row}-${col}`,
                        row,
                        col,
                        width: pieceW,
                        height: pieceH,
                        shape: shapes[row][col],
                        targetX: left + col * pieceW,
                        targetY: top + row * pieceH,
                        currentX: isLandscape
                            ? (Math.random() < 0.5
                                ? Math.random() * (left - pieceW) // Left side
                                : left + width + Math.random() * (window.innerWidth - (left + width) - pieceW)) // Right side
                            : Math.random() * (window.innerWidth - pieceW),
                        currentY: isLandscape
                            ? Math.random() * (window.innerHeight - pieceH)
                            : top + height + Math.random() * (window.innerHeight - (top + height) - pieceH),
                        isLocked: false,
                    })
                }
            }
            setPieces(newPieces)
            setLoaded(true)
        }
    }, [image, difficulty])

    const handleDragEnd = (id, info) => {
        setPieces(prev => {
            const piece = prev.find(p => p.id === id)
            if (!piece) return prev

            // Calculate drop position
            const draggedPieceX = piece.currentX + info.offset.x
            const draggedPieceY = piece.currentY + info.offset.y

            // Distance to target
            const dist = Math.hypot(draggedPieceX - piece.targetX, draggedPieceY - piece.targetY)

            if (dist < 60) { // Snap threshold
                playSnap()

                const newPieces = prev.map(p => {
                    if (p.id === id) {
                        return { ...p, currentX: p.targetX, currentY: p.targetY, isLocked: true }
                    }
                    return p
                })

                // Check win
                if (newPieces.every(p => p.isLocked)) {
                    playWin()
                    setTimeout(onWin, 500)
                }

                return newPieces
            } else {
                // Update position to where it was dropped (so it stays there)
                return prev.map(p => {
                    if (p.id === id) {
                        return { ...p, currentX: draggedPieceX, currentY: draggedPieceY }
                    }
                    return p
                })
            }
        })
    }

    if (!loaded) return <div className="text-white">Loading puzzle...</div>

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden backdrop-blur-sm bg-black/10">
            {/* Guide / Shadow Board */}
            <div
                className="absolute border-2 border-white/20 bg-white/5 rounded-lg"
                style={{
                    width: boardDimensions.width,
                    height: boardDimensions.height,
                    top: boardDimensions.top,
                    left: boardDimensions.left,
                }}
            >
                {/* Faint hint image */}
                {showBackground && (
                    <div
                        className="w-full h-full opacity-20 bg-contain bg-no-repeat"
                        style={{ backgroundImage: `url(${image})`, backgroundSize: `${boardDimensions.width}px ${boardDimensions.height}px` }}
                    />
                )}
            </div>

            {/* Pieces */}
            {pieces.map((piece) => (
                <PuzzlePiece
                    key={piece.id}
                    id={piece.id}
                    image={image}
                    width={piece.width}
                    height={piece.height}
                    x={piece.targetX - boardDimensions.left}
                    y={piece.targetY - boardDimensions.top}
                    boardWidth={boardDimensions.width}
                    boardHeight={boardDimensions.height}

                    currentX={piece.currentX}
                    currentY={piece.currentY}

                    onDragEnd={handleDragEnd}
                    isLocked={piece.isLocked}
                    shape={piece.shape}
                />
            ))}
        </div>
    )
}
