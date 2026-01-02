import { Routes, Route } from 'react-router-dom'
import GameSelector from './components/GameSelector'
import Layout from './components/Layout'
import { lazy, Suspense } from 'react'

const AlphabetFishing = lazy(() => import('./games/alphabet-fishing/AlphabetFishing'))
const CountingGame = lazy(() => import('./games/counting-game/CountingGame'))
const FlashCardGame = lazy(() => import('./games/flash-card-game/FlashCardGame'))
const FoodClassificationGame = lazy(() => import('./games/food-classification-game/FoodClassificationGame'))
const NorthAmericaMapGame = lazy(() => import('./games/north-america-map-game/NorthAmericaMapGame'))
const PuzzleGame = lazy(() => import('./games/puzzle-game/PuzzleGame'))
const USMapGame = lazy(() => import('./games/us-map-game/USMapGame'))
const WashingMachine = lazy(() => import('./games/washing-machine/WashingMachine'))
const WorldMapGame = lazy(() => import('./games/world-map-game/WorldMapGame'))
const SolarSystemGame = lazy(() => import('./games/solar-system-game/SolarSystemGame'))
const GeoGenieGame = lazy(() => import('./games/geogenie-game/GeoGenieGame'))
const WordPhonicsGame = lazy(() => import('./games/word-phonics-game/WordPhonicsGame'))

const GameLoading = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e1e2f, #2a2a40)',
        color: 'white',
        fontSize: '2rem'
    }}>
        Loading game...
    </div>
)

import { setupAudioUnlockListener } from './utils/audio'

function App() {
    // Enable audio unlock on first interaction
    setupAudioUnlockListener()

    return (
        <Suspense fallback={<GameLoading />}>
            <Routes>
                <Route path="/" element={<GameSelector />} />
                <Route element={<Layout />}>
                    <Route path="/alphabet-fishing" element={<AlphabetFishing />} />
                    <Route path="/counting-game" element={<CountingGame />} />
                    <Route path="/flash-card-game" element={<FlashCardGame />} />
                    <Route path="/food-classification-game" element={<FoodClassificationGame />} />
                    <Route path="/north-america-map-game" element={<NorthAmericaMapGame />} />
                    <Route path="/puzzle-game" element={<PuzzleGame />} />
                    <Route path="/us-map-game" element={<USMapGame />} />
                    <Route path="/washing-machine" element={<WashingMachine />} />
                    <Route path="/world-map-game" element={<WorldMapGame />} />
                    <Route path="/solar-system-game" element={<SolarSystemGame />} />
                    <Route path="/geogenie" element={<GeoGenieGame />} />
                    <Route path="/word-phonics-game" element={<WordPhonicsGame />} />
                </Route>
            </Routes>
        </Suspense>
    )
}

export default App
