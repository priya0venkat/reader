// GeoGenie Web Worker - Runs WebLLM in background thread
// Uses Qwen2.5-0.5B-Instruct for child-friendly geography tutoring

import * as webllm from '@mlc-ai/web-llm';

let engine = null;
let isLoading = false;

// Child-friendly system prompt for geography tutoring
const SYSTEM_PROMPT = `You are GeoGenie, a friendly geography tutor for 5-year-old children. 
Your job is to give VERY SHORT, simple hints to help kids find places on a map.

Rules:
- Use ONLY 1-2 short sentences
- Use simple words a 5-year-old understands
- Be encouraging and playful
- Never say the answer directly, just give a hint
- Use shapes, colors, positions (top, bottom, left, right)
- Reference things kids know (animals, food, cartoons)

Examples of good hints:
- "Look for the really big one at the top!"
- "It's shaped like a mitten!"
- "Find the one that looks like a boot!"
- "It's the sunny one on the left side!"`;

// Initialize the model
async function initModel(onProgress) {
    if (engine || isLoading) return;
    isLoading = true;

    try {
        // Use small model for mobile/browser compatibility
        const modelId = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC';

        engine = await webllm.CreateMLCEngine(modelId, {
            initProgressCallback: (progress) => {
                const percent = Math.round(progress.progress * 100);
                self.postMessage({
                    type: 'progress',
                    percent,
                    text: progress.text
                });
            }
        });

        isLoading = false;
        self.postMessage({ type: 'ready' });
    } catch (error) {
        isLoading = false;
        console.error('WebLLM init failed:', error);
        self.postMessage({ type: 'error', message: error.message });
    }
}

// Generate a hint for a target
async function generateHint(targetName, level, wrongGuess, tier) {
    if (!engine) {
        self.postMessage({
            type: 'hint',
            hint: null,
            useFallback: true
        });
        return;
    }

    try {
        const userPrompt = `The child needs to find "${targetName}" on the ${level} map. 
They clicked on "${wrongGuess}" by mistake.
Give a ${tier === 4 ? 'tricky' : tier === 3 ? 'medium' : tier === 2 ? 'easy' : 'very obvious'} hint.
Remember: just 1-2 short sentences!`;

        const response = await engine.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            max_tokens: 50,
            temperature: 0.7
        });

        const hint = response.choices[0]?.message?.content?.trim();

        self.postMessage({
            type: 'hint',
            hint: hint || null,
            useFallback: !hint
        });
    } catch (error) {
        console.error('Hint generation failed:', error);
        self.postMessage({
            type: 'hint',
            hint: null,
            useFallback: true
        });
    }
}

// Generate praise for correct answer
async function generatePraise(entityName) {
    if (!engine) {
        self.postMessage({
            type: 'praise',
            praise: null,
            useFallback: true
        });
        return;
    }

    try {
        const response = await engine.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are GeoGenie, an excited geography tutor for 5-year-olds. Give a VERY SHORT (3-6 words) celebration when they find a place correctly. Be super excited!' },
                { role: 'user', content: `The child found ${entityName}! Celebrate briefly!` }
            ],
            max_tokens: 20,
            temperature: 0.9
        });

        const praise = response.choices[0]?.message?.content?.trim();

        self.postMessage({
            type: 'praise',
            praise: praise || null,
            useFallback: !praise
        });
    } catch (error) {
        self.postMessage({
            type: 'praise',
            praise: null,
            useFallback: true
        });
    }
}

// Handle messages from main thread
self.onmessage = async (event) => {
    const { type, ...data } = event.data;

    switch (type) {
        case 'init':
            await initModel();
            break;
        case 'generateHint':
            await generateHint(data.targetName, data.level, data.wrongGuess, data.tier);
            break;
        case 'generatePraise':
            await generatePraise(data.entityName);
            break;
        default:
            console.warn('Unknown message type:', type);
    }
};
