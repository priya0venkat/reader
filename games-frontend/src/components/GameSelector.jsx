import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './GameSelector.css'
import InstallButton from './InstallButton'

const GAMES = [
    { path: '/alphabet-fishing', icon: '🎣', title: 'Alphabet Fishing', description: 'Catch the letters!' },
    { path: '/counting-game', icon: '🔢', title: 'Counting Game', description: 'Learn to count yummy treats!' },
    { path: '/flash-card-game', icon: '✨', title: 'Flash Cards', description: 'Learn words with pictures!' },
    { path: '/food-classification-game', icon: '🍎', title: 'Food Classifier', description: 'Sort the food items!' },
    { path: '/puzzle-game', icon: '🧩', title: 'Puzzle Game', description: 'Solve the picture puzzles!' },
    { path: '/washing-machine', icon: '🧺', title: 'Washing Machine', description: 'Assemble the parts correctly!' },
    { path: '/geogenie', icon: '🧞‍♂️', title: 'GeoGenie', description: 'Your AI Geography Tutor!' },
]

function GameSelector() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        try {
            const response = await fetch('/auth/me')
            if (response.ok) {
                const data = await response.json()
                if (data.authenticated) {
                    setUser(data.user)
                }
            }
        } catch (error) {
            console.error('Failed to fetch user status', error)
        }
    }

    return (
        <div className="game-selector">
            <div className="login-container">
                {user ? (
                    <div className="user-info">
                        <span>Welcome, {user.displayName}</span>
                        <a href="/auth/logout" className="logout-btn">Logout</a>
                    </div>
                ) : (
                    <a href="/auth/google" className="login-btn">
                        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in with Google
                    </a>
                )}
            </div>

            <h1>Verma Games</h1>

            <InstallButton />

            <div className="games-container">
                {GAMES.map((game) => (
                    <Link key={game.path} to={game.path} className="game-card">
                        <span className="game-icon">{game.icon}</span>
                        <h2>{game.title}</h2>
                        <p>{game.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default GameSelector
