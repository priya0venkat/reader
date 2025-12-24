import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Game } from './components/Game'
import './styles.css'

function WashingMachine() {
    const navigate = useNavigate()

    return (
        <div className="App">
            <button onClick={() => navigate('/')} className="home-btn" style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                fontSize: '2rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                zIndex: 100
            }}>🏠</button>
            <Game />
        </div>
    )
}

export default WashingMachine
