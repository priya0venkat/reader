// Audio utility functions for food classification game

/**
 * Speaks the given text using the Web Speech API
 * @param {string} text - The text to speak
 * @param {number} rate - Speech rate (0.1 to 10, default 1)
 * @param {number} pitch - Speech pitch (0 to 2, default 1)
 */
export const speak = (text, rate = 1, pitch = 1) => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported in this browser');
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
};

/**
 * Announces the food item and asks for its category
 * @param {string} foodName - Name of the food item
 */
export const announceFoodItem = (foodName) => {
    const question = `${foodName} has?`;
    speak(question, 0.9, 1);
};

/**
 * Plays a tone using Web Audio API
 * @param {number} frequency - Frequency in Hz
 * @param {string} type - Oscillator type ('sine', 'square', 'sawtooth', 'triangle')
 * @param {number} duration - Duration in seconds
 * @param {number} volume - Volume (0 to 1)
 */
export const playTone = (frequency, type = 'sine', duration = 0.2, volume = 0.3) => {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);

        // Clean up context after a short delay
        setTimeout(() => {
            if (audioContext.state !== 'closed') {
                audioContext.close();
            }
        }, duration * 1000 + 100);
    } catch (error) {
        console.warn('Audio playback error:', error);
    }
};

/**
 * Provides audio feedback for correct answer
 */
export const playCorrectSound = () => {
    speak('Correct!', 1.2, 1.2);
    // Play a pleasant ascending tone
    playTone(523.25, 'sine', 0.15, 0.3); // C note
    setTimeout(() => playTone(659.25, 'sine', 0.15, 0.3), 100); // E note
};

/**
 * Provides audio feedback for incorrect answer
 */
export const playWrongSound = () => {
    speak('Try again', 1, 0.9);
    // Play a lower descending tone
    playTone(196, 'sawtooth', 0.25, 0.25); // Lower G note
};

/**
 * Plays a celebration sound for game completion
 */
export const playCelebrationSound = () => {
    speak('Great job! You completed the game!', 1, 1.1);
    // Play ascending celebratory tones
    setTimeout(() => playTone(523.25, 'sine', 0.2, 0.3), 0);    // C
    setTimeout(() => playTone(659.25, 'sine', 0.2, 0.3), 150);  // E
    setTimeout(() => playTone(783.99, 'sine', 0.3, 0.3), 300);  // G
    setTimeout(() => playTone(1046.50, 'sine', 0.4, 0.3), 500); // High C
};

