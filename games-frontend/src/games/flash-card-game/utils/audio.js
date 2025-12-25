import { TtsSession } from '@mintplex-labs/piper-tts-web';

// Mapping for individual letter sounds if needed as fallback or for manual construction
const PHONETIC_MAP = {
    A: "Aa",
    B: "Buh",
    C: "Kuh",
    D: "Duh",
    E: "Eh",
    F: "Fuh",
    G: "Guh",
    H: "Huh",
    I: "Ih",
    J: "Juh",
    K: "Kuh",
    L: "Luh",
    M: "Muh",
    N: "Nuh",
    O: "Aw",
    P: "Puh",
    Q: "Kwuh",
    R: "Ruh",
    S: "Suh",
    T: "Tuh",
    U: "Uh",
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

export const unlockAudioContext = () => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    // Play silent buffer
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

        session = new TtsSession({
            voiceId: 'en_US-amy-low',
            progress: (percent) => {
                const p = Math.round(percent);
                const progressText = isNaN(p) || !isFinite(p) ? '...' : `${p}%`;
                if (callback) callback(`Loading: ${progressText}`);
            },
            logger: (msg) => console.log("[Piper]", msg),
            wasmPaths: {
                onnxWasm: `${window.location.origin}${import.meta.env.BASE_URL}onnx/`,
                piperData: `${window.location.origin}${import.meta.env.BASE_URL}piper/piper_phonemize.data`,
                piperWasm: `${window.location.origin}${import.meta.env.BASE_URL}piper/piper_phonemize.wasm`,
            }
        });

        await session.init();
        isInitializing = false;
        if (callback) callback("Ready");
        return "Ready";
    } catch (err) {
        console.error("Failed to init Piper:", err);
        isInitializing = false;
        session = null;
        if (callback) callback("Audio Failed");
        throw err;
    }
};

export const speakText = async (text) => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
        try {
            await ctx.resume();
        } catch (e) {
            console.warn("Could not resume audio context", e);
        }
    }

    if (!session) {
        console.warn("Piper not initialized, using fallback");
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
        return;
    }

    try {
        const blob = await session.predict(text);
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start(0);
    } catch (err) {
        console.error("Piper speak error:", err);
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
};
