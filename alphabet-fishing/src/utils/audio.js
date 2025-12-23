import { TtsSession } from '@mintplex-labs/piper-tts-web';

const PHONETIC_MAP = {
    A: "Aa",    // "a" as in apple
    B: "Buh",
    C: "Kuh",
    D: "Duh",
    E: "Eh",    // "e" as in egg
    F: "Fuh",
    G: "Guh",
    H: "Huh",
    I: "Ih",    // "i" as in iguana
    J: "Juh",
    K: "Kuh",
    L: "Luh",
    M: "Muh",
    N: "Nuh",
    O: "Aw",    // "o" as in octopus
    P: "Puh",
    Q: "Kwuh",
    R: "Ruh",
    S: "Suh",
    T: "Tuh",
    U: "Uh",    // "u" as in umbrella
    V: "Vuh",
    W: "Wuh",
    X: "Ks",
    Y: "Yuh",
    Z: "Zuh"
};

let session = null;
let isInitializing = false;
let audioContext = null;

const getAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
};

// Must be called from a user gesture (click/touch)
export const unlockAudioContext = () => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    // Play a silent short buffer to force the audio engine to unlock
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
};

export const initPiper = async (callback) => {
    if (session) return "Ready";
    if (isInitializing) return "Initializing...";

    isInitializing = true;
    try {
        if (callback) callback("Initializing Audio...");

        // TtsSession handles model downloading and WASM initialization using defaults (CDN)
        // Using 'low' quality for faster load and better stability testing
        session = new TtsSession({
            voiceId: 'en_US-amy-low',
            progress: (percent) => {
                const p = Math.round(percent);
                // Handle NaN or Infinity if content-length is missing
                const progressText = isNaN(p) || !isFinite(p) ? '...' : `${p}%`;
                if (callback) callback(`Loading: ${progressText}`);
            },
            logger: (msg) => console.log("[Piper]", msg),
            wasmPaths: {
                // Ensure we point to the local public/onnx folder for the WASM files
                onnxWasm: `${window.location.origin}${import.meta.env.BASE_URL}onnx/`,
                piperData: `${window.location.origin}${import.meta.env.BASE_URL}piper/piper_phonemize.data`,
                piperWasm: `${window.location.origin}${import.meta.env.BASE_URL}piper/piper_phonemize.wasm`,
            }
        });

        // Initialize the session (downloads model and config)
        await session.init();

        isInitializing = false;
        if (callback) callback("Ready");
        return "Ready";
    } catch (err) {
        console.error("Failed to init Piper:", err);
        isInitializing = false;
        session = null;
        // Return only the error message to fit in the UI
        const errMsg = err.message || "Unknown Error";
        if (callback) callback(`Failed: ${errMsg.slice(0, 20)}...`);
        throw err;
    }
};

export const speakText = async (text) => {
    // Ensure AudioContext is initialized and resumed (must be triggered by interaction ideally first time)
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
        try {
            await ctx.resume();
        } catch (e) {
            console.warn("Could not resume audio context", e);
        }
    }

    if (!session) {
        console.warn("Piper not initialized, trying fallback");
        // Fallback to browser TTS if Piper isn't ready
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
        return;
    }

    try {
        if (typeof text !== 'string' || !text.trim()) {
            console.warn("Invalid text to speak:", text);
            return;
        }

        // Piper generates an audio blob
        const blob = await session.predict(text);

        // Convert Blob to ArrayBuffer
        const arrayBuffer = await blob.arrayBuffer();

        // Decode Audio Data
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

        // Play AudioBuffer
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start(0);

    } catch (err) {
        console.error("Piper speak error:", err);
        // Fallback on error
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
};

export const getPhonetic = (letter) => {
    return PHONETIC_MAP[letter.toUpperCase()] || letter;
};

// Helper to convert typical sentences to phonetic representations for single letters
// e.g. "Fish me B" -> "Fish me Buh"
export const phonetizeSentence = (sentence) => {
    // This regex looks for single capital letters surrounded by spaces or at ends of string
    // and replaces them with their phonetic equivalent
    return sentence.replace(/\b([A-Z])\b/g, (match) => getPhonetic(match));
};
