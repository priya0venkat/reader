import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Game } from './components/Game'
import trackingService from '../../services/trackingService'
import './styles.css'

function WashingMachine() {
    const navigate = useNavigate()

    React.useEffect(() => {
        trackingService.initSession('washing-machine', 'standard');
    }, []);

    return (
        <div className="App">
            <button onClick={() => { trackingService.saveSession(); navigate('/'); }} className="home-btn" style={{
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
