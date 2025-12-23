import * as tts from '@mintplex-labs/piper-tts-web';

const PHONETIC_MAP = {
    A: "Ah",
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
    Q: "Qwuh",
    R: "Rrruh",
    S: "Sss",
    T: "Tuh",
    U: "Uh",
    V: "Vvv",
    W: "Wuh",
    X: "Ks",
    Y: "Yuh",
    Z: "Zzz"
};

let piperInstance = null;
let isInitializing = false;

export const initPiper = async (callback) => {
    if (piperInstance) return piperInstance;
    if (isInitializing) return;

    isInitializing = true;
    try {
        // Using a high quality US English female voice
        // Model: en_US-amy-medium
        // Hosted on Hugging Face or similar stable CDN for this library validation
        const voiceUrl = 'https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/amy/medium/en_US-amy-medium.onnx?download=true';
        const configUrl = 'https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/amy/medium/en_US-amy-medium.onnx.json?download=true';

        piperInstance = new tts.Piper();

        // callback for progress updates
        if (callback) {
            callback("Downloading voice model...");
        }

        await piperInstance.init({
            url: voiceUrl,
            config: configUrl,
            onProgress: (percent) => {
                if (callback) callback(`Loading: ${Math.round(percent)}%`);
            }
        });

        isInitializing = false;
        if (callback) callback("Ready");
        return piperInstance;
    } catch (err) {
        console.error("Failed to init Piper:", err);
        isInitializing = false;
        if (callback) callback("Error loading voice");
        throw err;
    }
};

export const speakText = async (text) => {
    if (!piperInstance) {
        console.warn("Piper not initialized, trying fallback");
        // Fallback to browser TTS if Piper isn't ready
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
        return;
    }

    try {
        await piperInstance.speak({ text });
    } catch (err) {
        console.error("Piper speak error:", err);
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
