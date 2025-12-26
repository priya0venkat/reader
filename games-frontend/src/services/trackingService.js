export const trackingService = {
    session: null,

    /**
     * Initialize a new game session
     * @param {string} gameId - Unique identifier for the game (e.g., 'alphabet-fishing')
     * @param {string} levelId - Identifier for level or mode (e.g., 'capital-letters')
     */
    initSession(gameId, levelId = 'standard', mode = 'standard') {
        this.session = {
            gameId,
            levelId,
            mode,
            startTime: Date.now(),
            score: 0,
            totalAttempts: 0,
            interactions: [], // log of specific events if needed
            entities: {} // aggregate stats per item
        };
        console.log(`[Tracking] Session started: ${gameId} (${levelId})`);
    },

    /**
     * Record an interaction (correct/incorrect attempt)
     * @param {string} target - What the user was supposed to find/do
     * @param {string} actual - What the user actually selected/did
     * @param {boolean} isCorrect - Whether it was correct
     */
    trackInteraction(target, actual, isCorrect) {
        if (!this.session) return;

        this.session.totalAttempts++;
        if (isCorrect) {
            this.session.score++;
        }

        // Update entity-level stats
        // We track stats for the TARGET item (how hard was it to find X?)
        if (!this.session.entities[target]) {
            this.session.entities[target] = { correct: 0, incorrect: 0 };
        }

        if (isCorrect) {
            this.session.entities[target].correct++;
        } else {
            this.session.entities[target].incorrect++;
        }

        // Optional: track detailed log
        this.session.interactions.push({
            timestamp: Date.now(),
            target,
            actual,
            isCorrect
        });
    },

    /**
     * Save the current session to the backend
     */
    async saveSession() {
        if (!this.session) return;

        const duration = Math.round((Date.now() - this.session.startTime) / 1000);
        const stats = {
            ...this.session,
            duration
        };

        try {
            const response = await fetch('/api/stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(stats)
            });

            if (response.ok) {
                console.log('[Tracking] Session saved successfully');
            } else {
                console.error('[Tracking] Failed to save session', await response.text());
            }
        } catch (error) {
            console.error('[Tracking] Error saving session', error);
        }

        this.session = null; // Clear session
    }
};

export default trackingService;
