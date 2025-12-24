import { speakText, unlockAudioContext } from '../utils/audio';

const StartScreen = ({ onStart }) => {
    const handleStart = (mode) => {
        // Unlock audio immediately on user gesture
        unlockAudioContext();

        // Warm up TTS
        speakText("Welcome");
        onStart(mode);
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
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={() => handleStart('capital')}
                    style={{
                        fontSize: '1.5rem',
                        padding: '1rem 2rem',
                        borderRadius: '50px',
                        background: '#FFD700',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                        cursor: 'pointer'
                    }}
                >
                    Capital Letters
                </button>
                <button
                    onClick={() => handleStart('small')}
                    style={{
                        fontSize: '1.5rem',
                        padding: '1rem 2rem',
                        borderRadius: '50px',
                        background: '#4CC9F0',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                        cursor: 'pointer'
                    }}
                >
                    Small Letters
                </button>
                <button
                    onClick={() => handleStart('number')}
                    style={{
                        fontSize: '1.5rem',
                        padding: '1rem 2rem',
                        borderRadius: '50px',
                        background: '#F72585',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                        cursor: 'pointer'
                    }}
                >
                    Numbers 1-10
                </button>
            </div>
        </div>
    );
};

export default StartScreen;
