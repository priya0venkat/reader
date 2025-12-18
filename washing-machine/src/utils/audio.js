// Create a washing machine sound effect using Web Audio API
export function playWashingMachineSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create oscillators for the washing machine motor sound
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();

    // Create gain nodes for volume control
    const gainNode1 = audioContext.createGain();
    const gainNode2 = audioContext.createGain();
    const masterGain = audioContext.createGain();

    // Set oscillator types and frequencies
    oscillator1.type = 'sawtooth';
    oscillator1.frequency.setValueAtTime(80, audioContext.currentTime);

    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(120, audioContext.currentTime);

    // Set initial volumes
    gainNode1.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode2.gain.setValueAtTime(0.1, audioContext.currentTime);
    masterGain.gain.setValueAtTime(0.3, audioContext.currentTime);

    // Connect the audio graph
    oscillator1.connect(gainNode1);
    oscillator2.connect(gainNode2);
    gainNode1.connect(masterGain);
    gainNode2.connect(masterGain);
    masterGain.connect(audioContext.destination);

    // Create frequency modulation for the "spinning" effect
    const now = audioContext.currentTime;
    const duration = 5;

    // Gradually increase frequency to simulate spin-up
    oscillator1.frequency.linearRampToValueAtTime(100, now + 1);
    oscillator2.frequency.linearRampToValueAtTime(150, now + 1);

    // Add some wobble to simulate washing machine vibration
    oscillator1.frequency.setValueAtTime(100, now + 1);
    oscillator1.frequency.linearRampToValueAtTime(95, now + 2);
    oscillator1.frequency.linearRampToValueAtTime(105, now + 3);
    oscillator1.frequency.linearRampToValueAtTime(100, now + 4);

    // Fade out at the end
    masterGain.gain.linearRampToValueAtTime(0, now + duration);

    // Start and stop
    oscillator1.start(now);
    oscillator2.start(now);
    oscillator1.stop(now + duration);
    oscillator2.stop(now + duration);
}
