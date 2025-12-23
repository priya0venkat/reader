import { speakText } from '../utils/audio';

const StartScreen = ({ onStart }) => {
    const handleStart = () => {
        // Warm up TTS
        speakText("Welcome");
        onStart();
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            zIndex: 10
        }}>
            <h1 style={{ fontSize: '4rem', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                Alphabet Fishing
            </h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                Catch the letters!
            </p>
            <button
                onClick={handleStart}
                style={{
                    fontSize: '2rem',
                    padding: '1rem 3rem',
                    borderRadius: '50px',
                    background: '#FFD700',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    cursor: 'pointer'
                }}
            >
                Play
            </button>
        </div>
    );
};

export default StartScreen;
