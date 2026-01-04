import React from 'react'
import { useNavigate } from 'react-router-dom'
import { WashingMachine3D } from './components/WashingMachine3D'
import trackingService from '../../services/trackingService'
import './styles.css'

function WashingMachine() {
    const navigate = useNavigate()

    React.useEffect(() => {
        trackingService.initSession('washing-machine', '3d-webgl');
    }, []);

    return (
        <div className="App">
            <button onClick={() => { trackingService.saveSession(); navigate('/'); }} className="home-btn">
                🏠
            </button>
            <h1 className="game-title">🧺 Washing Machine Simulator</h1>
            <WashingMachine3D />
        </div>
    )
}

export default WashingMachine
