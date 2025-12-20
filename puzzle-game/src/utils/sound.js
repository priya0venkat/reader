export const playSnap = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    // Create new context or reuse one? Best to reuse if possible, but for sparse events new is fine.
    // Browsers limit number of contexts. Let's try to close it or use a singleton.
    // Singleton pattern better.
    const ctx = getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // "Thock" / Snap sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
}

export const playWin = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    // Fanfare Arpeggio
    const notes = [
        523.25, // C5
        659.25, // E5
        783.99, // G5
        1046.50, // C6
        783.99,
        1046.50
    ];

    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = i % 2 === 0 ? 'sine' : 'triangle'; // Mix types for texture
        osc.frequency.value = freq;

        const start = ctx.currentTime + i * 0.1;
        const dur = 0.3;

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.2, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.start(start);
        osc.stop(start + dur);
    });
}

// Singleton context to avoid "max AudioContext" errors
let audioContext = null;
function getAudioContext() {
    if (!audioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioContext = new AudioContext();
        }
    }
    return audioContext;
}
