// GeoGenie API - Main thread interface for AI tutoring
// Handles WebLLM initialization and fallback to template hints

import { speakText, initPiper, unlockAudioContext } from '../../utils/audio';
import { scaffoldingManager } from './scaffoldingManager';
import { getHint as getSolarHint, PHRASES as solarPhrases, solarSystemKnowledge } from './data/solarSystemKnowledge';
import { getHint as getWorldHint, PHRASES as worldPhrases, continentKnowledge } from './data/worldMapKnowledge';
import { getHint as getNorthAmericaHint, PHRASES as northAmericaPhrases, countryKnowledge } from './data/northAmericaKnowledge';
import { getHint as getUSStateHint, PHRASES as usStatesPhrases, stateKnowledge } from './data/usStatesKnowledge';

// GeoGenie state
let isInitialized = false;
let useAI = false; // Will be true if WebLLM loads successfully
let worker = null;
let pendingHintResolve = null;
let pendingPraiseResolve = null;
let aiInitProgress = 0;

// Check WebGPU support
const checkWebGPU = async () => {
    if (!navigator.gpu) {
        console.log('WebGPU not available, using fallback hints');
        return false;
    }
    try {
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            console.log('No WebGPU adapter, using fallback hints');
            return false;
        }
        return true;
    } catch (e) {
        console.log('WebGPU check failed:', e);
        return false;
    }
};

// Handle worker messages
const handleWorkerMessage = (event) => {
    const { type, ...data } = event.data;

    // Helper to sanitize markdown and special chars for TTS
    const sanitizeForTTS = (text) => {
        if (!text) return text;
        return text
            .replace(/[*#_\[\]~`]/g, '') // Remove markdown chars
            .replace(/\bIT\b/g, 'it')    // Fix 'IT' being read as 'I.T.'
            .replace(/\s+/g, ' ')        // Normalize whitespace
            .trim();
    };

    switch (type) {
        case 'progress':
            aiInitProgress = data.percent;
            console.log(`[GeoGenie AI] Loading: ${data.percent}% - ${data.text}`);
            break;
        case 'ready':
            useAI = true;
            console.log('[GeoGenie AI] Model loaded and ready!');
            break;
        case 'error':
            console.error('[GeoGenie AI] Error:', data.message);
            useAI = false;
            break;
        case 'hint':
            if (pendingHintResolve) {
                if (data.hint) {
                    data.hint = sanitizeForTTS(data.hint);
                }
                pendingHintResolve(data);
                pendingHintResolve = null;
            }
            break;
        case 'praise':
            if (pendingPraiseResolve) {
                if (data.praise) {
                    data.praise = sanitizeForTTS(data.praise);
                }
                pendingPraiseResolve(data);
                pendingPraiseResolve = null;
            }
            break;
    }
};

// Request AI hint (returns promise)
const requestAIHint = (targetName, level, wrongGuess, tier) => {
    return new Promise((resolve) => {
        if (!worker || !useAI) {
            resolve({ hint: null, useFallback: true });
            return;
        }

        pendingHintResolve = resolve;

        // Timeout fallback after 5 seconds
        setTimeout(() => {
            if (pendingHintResolve) {
                pendingHintResolve({ hint: null, useFallback: true });
                pendingHintResolve = null;
            }
        }, 5000);

        worker.postMessage({
            type: 'generateHint',
            targetName,
            level,
            wrongGuess,
            tier
        });
    });
};

// Request AI praise (returns promise)
const requestAIPraise = (entityName) => {
    return new Promise((resolve) => {
        if (!worker || !useAI) {
            resolve({ praise: null, useFallback: true });
            return;
        }

        pendingPraiseResolve = resolve;

        // Timeout fallback after 6 seconds (increased for Llama-1B)
        setTimeout(() => {
            if (pendingPraiseResolve) {
                pendingPraiseResolve({ praise: null, useFallback: true });
                pendingPraiseResolve = null;
            }
        }, 6000);

        worker.postMessage({
            type: 'generatePraise',
            entityName
        });
    });
};

// Initialize GeoGenie
export const initGeoGenie = async (onStatusUpdate) => {
    if (isInitialized) return { ready: true, aiEnabled: useAI };

    try {
        // Initialize Piper TTS first
        await initPiper((status) => {
            if (onStatusUpdate) onStatusUpdate(status);
        });

        // Check WebGPU for AI features
        const hasWebGPU = await checkWebGPU();

        if (hasWebGPU) {
            try {
                if (onStatusUpdate) onStatusUpdate('Loading AI...');

                // Initialize WebLLM worker
                worker = new Worker(
                    new URL('./GeoGenieWorker.js', import.meta.url),
                    { type: 'module' }
                );
                worker.onmessage = handleWorkerMessage;
                worker.onerror = (e) => {
                    console.error('[GeoGenie Worker] Error:', e);
                    useAI = false;
                };

                // Start model loading (non-blocking)
                worker.postMessage({ type: 'init' });

                console.log('[GeoGenie] AI worker started, model loading in background');
            } catch (e) {
                console.error('[GeoGenie] Failed to start AI worker:', e);
                useAI = false;
            }
        }

        isInitialized = true;
        if (onStatusUpdate) onStatusUpdate('Ready');

        return { ready: true, aiEnabled: hasWebGPU };
    } catch (error) {
        console.error('GeoGenie init failed:', error);
        isInitialized = true; // Still usable with fallbacks
        return { ready: true, aiEnabled: false };
    }
};

// Get the right hint function and phrases for a level
const getLevelHintConfig = (level) => {
    switch (level) {
        case 'solar-system':
            return { getHint: getSolarHint, phrases: solarPhrases };
        case 'world-map':
            return { getHint: getWorldHint, phrases: worldPhrases };
        case 'north-america':
            return { getHint: getNorthAmericaHint, phrases: northAmericaPhrases };
        case 'us-states':
            return { getHint: getUSStateHint, phrases: usStatesPhrases };
        default:
            return { getHint: () => 'Look carefully!', phrases: { correct: ['Good!'], encouragement: ['Try again!'] } };
    }
};

// Handle correct answer
export const handleCorrectAnswer = async (entityName, level, gameMode = 'quiz') => {
    const result = scaffoldingManager.recordSuccess(entityName, level);
    const { phrases } = getLevelHintConfig(level);

    let message;

    // Train mode: speak the fun fact instead of praise
    if (gameMode === 'train') {
        // Get fun fact from knowledge data
        const { getHint } = getLevelHintConfig(level);
        // Fun facts are stored in tier 1 hints or in knowledge objects
        // We'll use a simple fact message for train mode
        message = `Great! Let's learn about the next one!`;
        // Don't speak - the level component already shows the fact
        // Just return without speaking
        return {
            type: 'success',
            message,
            masteryScore: result.masteryScore,
            aiGenerated: false
        };
    }

    // Quiz mode: use praise
    // Quiz mode: use fun fact instead of praise
    let knowledge = null;
    switch (level) {
        case 'solar-system':
            knowledge = solarSystemKnowledge[entityName];
            break;
        case 'world-map':
            knowledge = continentKnowledge[entityName];
            break;
        case 'north-america':
            knowledge = countryKnowledge[entityName];
            break;
        case 'us-states':
            knowledge = stateKnowledge[entityName];
            break;
    }

    let funFact = '';
    if (knowledge?.funFact) {
        funFact = Array.isArray(knowledge.funFact)
            ? knowledge.funFact[Math.floor(Math.random() * knowledge.funFact.length)]
            : knowledge.funFact;
    }

    // Fallback to template praise if no fact
    if (!funFact) {
        const praise = phrases.correct[Math.floor(Math.random() * phrases.correct.length)];
        funFact = praise;
    }

    message = `That's right! ${funFact}`;

    // Speak the praise
    await speakText(message);

    return {
        type: 'success',
        message,
        masteryScore: result.masteryScore,
        aiGenerated: useAI
    };
};

// Handle incorrect answer
export const handleIncorrectAnswer = async (targetEntity, clickedEntity, level) => {
    const result = scaffoldingManager.recordError(targetEntity, level, clickedEntity);
    const { getHint, phrases } = getLevelHintConfig(level);

    let message;
    let visualCommand = null;
    let aiGenerated = false;

    if (result.isInRescueMode) {
        // Rescue mode - direct help
        message = `I'll help you! ${targetEntity} is glowing now. Tap the glowing one!`;
        visualCommand = {
            action: 'highlight',
            target: targetEntity
        };
    } else {
        // Use knowledge base hints instead of AI for better accuracy/consistency
        // (User requested to use static hints over LLM)
        /* 
        if (useAI) {
            const aiResult = await requestAIHint(targetEntity, level, clickedEntity, result.currentTier);
            if (!aiResult.useFallback && aiResult.hint) {
                const encouragement = phrases.encouragement[Math.floor(Math.random() * phrases.encouragement.length)];
                message = clickedEntity
                    ? `That's ${clickedEntity}! ${encouragement} ${aiResult.hint}`
                    : `${encouragement} ${aiResult.hint}`;
                aiGenerated = true;
            }
        } 
        */

        // Always use template/knowledge base hint
        if (!message) {
            const hint = getHint(targetEntity, result.currentTier);
            const encouragement = phrases.encouragement[Math.floor(Math.random() * phrases.encouragement.length)];

            if (clickedEntity) {
                message = `That's ${clickedEntity}! ${encouragement} ${hint}`;
            } else {
                message = `${encouragement} ${hint}`;
            }
        }
    }

    // Speak the hint
    await speakText(message);

    return {
        type: 'hint',
        message,
        tier: result.currentTier,
        isRescue: result.isInRescueMode,
        visualCommand,
        consecutiveErrors: result.consecutiveErrors,
        aiGenerated
    };
};

// Handle timeout (child hasn't interacted)
export const handleTimeout = async (targetEntity, level) => {
    const result = scaffoldingManager.checkTimeout();

    if (!result.isTimeout) return null;

    const { getHint } = getLevelHintConfig(level);
    const hint = getHint(targetEntity, result.currentTier);

    let message;
    let visualCommand = null;

    if (result.shouldRescue) {
        message = `Let me help you find ${targetEntity}! Look where it's glowing!`;
        visualCommand = {
            action: 'highlight',
            target: targetEntity
        };
    } else {
        message = `Need a hint? ${hint}`;
    }

    await speakText(message);

    return {
        type: 'timeout_hint',
        message,
        tier: result.currentTier,
        isRescue: result.shouldRescue,
        visualCommand
    };
};

// Start a new turn
export const startTurn = (targetEntity, level) => {
    const tier = scaffoldingManager.startTurn(targetEntity, level);
    return { tier };
};

// Announce the target
export const announceTarget = async (targetEntity, level, gameMode = 'quiz', specificFact = null) => {
    let message;

    // Train mode: teach instead of quiz
    if (gameMode === 'train') {
        // Get fun fact from knowledge data or use provided specificFact
        let funFact = specificFact;

        if (!funFact) {
            let knowledge = null;
            switch (level) {
                case 'solar-system':
                    knowledge = solarSystemKnowledge[targetEntity];
                    break;
                case 'world-map':
                    knowledge = continentKnowledge[targetEntity];
                    break;
                case 'north-america':
                    knowledge = countryKnowledge[targetEntity];
                    break;
                case 'us-states':
                    knowledge = stateKnowledge[targetEntity];
                    break;
            }

            if (knowledge?.funFact) {
                funFact = Array.isArray(knowledge.funFact)
                    ? knowledge.funFact[Math.floor(Math.random() * knowledge.funFact.length)]
                    : knowledge.funFact;
            }
        }

        // Speak introduction and fun fact together
        message = `This is ${targetEntity}! ${funFact || ''}`;
    } else {
        // Quiz mode: ask to find
        switch (level) {
            case 'solar-system':
                message = `Find ${targetEntity}!`;
                break;
            case 'world-map':
                message = `Can you find ${targetEntity}?`;
                break;
            case 'north-america':
                message = `Where is ${targetEntity}?`;
                break;
            case 'us-states':
                message = `Tap on ${targetEntity}!`;
                break;
            default:
                message = `Find ${targetEntity}!`;
        }
    }

    await speakText(message);
    return message;
};

// Level complete announcement
export const announceLevelComplete = async (level) => {
    const { phrases } = getLevelHintConfig(level);
    const message = phrases.levelComplete || "Great job! You finished this level!";
    await speakText(message);
    return message;
};

// Get mastery info for a level
export const getLevelMasteryInfo = (level, entities) => {
    const mastered = scaffoldingManager.isLevelMastered(level, entities, 0.7);
    const needsPractice = scaffoldingManager.getEntitiesNeedingPractice(level, entities);

    return {
        isFullyMastered: mastered,
        needsPractice,
        masteredCount: entities.length - needsPractice.length,
        totalCount: entities.length
    };
};

// Get AI status
export const getAIStatus = () => ({
    enabled: useAI,
    progress: aiInitProgress
});

// Unlock audio (must be called from user gesture)
export const unlockAudio = () => {
    unlockAudioContext();
};

// Reset session
export const resetSession = () => {
    scaffoldingManager.resetSession();
};

export default {
    initGeoGenie,
    handleCorrectAnswer,
    handleIncorrectAnswer,
    handleTimeout,
    startTurn,
    announceTarget,
    announceLevelComplete,
    getLevelMasteryInfo,
    getAIStatus,
    unlockAudio,
    resetSession
};
