// Scaffolding Manager for GeoGenie
// Implements ZPD (Zone of Proximal Development) tracking
// Manages 4-tier scaffolding: 4=hardest (conceptual) → 1=easiest (visual cue)

const STORAGE_KEY = 'geogenie_mastery';
const MAX_CONSECUTIVE_ERRORS = 3;
const TIMEOUT_THRESHOLD_MS = 10000; // 10 seconds

// Load mastery data from localStorage
const loadMasteryData = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.warn('Could not load mastery data:', e);
        return {};
    }
};

// Save mastery data to localStorage
const saveMasteryData = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Could not save mastery data:', e);
    }
};

class ScaffoldingManager {
    constructor() {
        this.masteryData = loadMasteryData();
        this.sessionState = {
            currentTarget: null,
            consecutiveErrors: 0,
            lastInteractionTime: Date.now(),
            currentTier: 4, // Start with hardest (least help)
            isInRescueMode: false
        };
    }

    // Initialize or get mastery for an entity
    getMastery(entityName, level) {
        const key = `${level}:${entityName}`;
        if (!this.masteryData[key]) {
            this.masteryData[key] = {
                attempts: 0,
                successes: 0,
                lastSeen: null,
                averageTime: null
            };
        }
        return this.masteryData[key];
    }

    // Calculate mastery score (0-1)
    getMasteryScore(entityName, level) {
        const mastery = this.getMastery(entityName, level);
        if (mastery.attempts === 0) return 0;
        return mastery.successes / mastery.attempts;
    }

    // Start a new turn/question
    startTurn(targetName, level) {
        // Only reset if target actually changed (prevents erroneous resets from React re-renders)
        if (this.sessionState.currentTarget === targetName) {
            console.log('[Scaffolding] startTurn skipped - same target:', targetName);
            return this.sessionState.currentTier;
        }

        console.log('[Scaffolding] startTurn - new target:', targetName, 'previous:', this.sessionState.currentTarget);
        this.sessionState.currentTarget = targetName;
        this.sessionState.consecutiveErrors = 0;
        this.sessionState.lastInteractionTime = Date.now();
        this.sessionState.isInRescueMode = false;

        // Determine starting tier based on mastery
        const masteryScore = this.getMasteryScore(targetName, level);
        if (masteryScore > 0.8) {
            // High mastery - start at hardest (minimal help)
            this.sessionState.currentTier = 4;
        } else if (masteryScore > 0.5) {
            this.sessionState.currentTier = 3;
        } else if (masteryScore > 0.2) {
            this.sessionState.currentTier = 2;
        } else {
            // Low mastery or new - still try tier 3 first
            this.sessionState.currentTier = 3;
        }

        return this.sessionState.currentTier;
    }

    // Record a correct answer
    recordSuccess(entityName, level) {
        const mastery = this.getMastery(entityName, level);
        mastery.attempts++;
        mastery.successes++;
        mastery.lastSeen = Date.now();

        // Update average response time
        const responseTime = Date.now() - this.sessionState.lastInteractionTime;
        if (mastery.averageTime === null) {
            mastery.averageTime = responseTime;
        } else {
            mastery.averageTime = (mastery.averageTime + responseTime) / 2;
        }

        saveMasteryData(this.masteryData);

        return {
            isSuccess: true,
            wasQuick: responseTime < 3000, // Quick response bonus
            masteryScore: this.getMasteryScore(entityName, level)
        };
    }

    // Record an incorrect answer
    recordError(entityName, level, clickedEntity) {
        const mastery = this.getMastery(entityName, level);
        mastery.attempts++;
        mastery.lastSeen = Date.now();

        this.sessionState.consecutiveErrors++;
        console.log('[Scaffolding] Error recorded. consecutiveErrors:', this.sessionState.consecutiveErrors, 'target:', entityName, 'clicked:', clickedEntity);
        saveMasteryData(this.masteryData);

        // Determine if we should downgrade scaffold tier
        const shouldDowngrade = this.sessionState.consecutiveErrors >= 1;
        if (shouldDowngrade && this.sessionState.currentTier > 1) {
            this.sessionState.currentTier--;
        }

        // Check for frustration zone
        const isInFrustrationZone = this.sessionState.consecutiveErrors >= MAX_CONSECUTIVE_ERRORS;
        console.log('[Scaffolding] isInFrustrationZone:', isInFrustrationZone, 'threshold:', MAX_CONSECUTIVE_ERRORS);
        if (isInFrustrationZone) {
            this.sessionState.isInRescueMode = true;
            this.sessionState.currentTier = 1; // Direct visual cue
            console.log('[Scaffolding] RESCUE MODE ACTIVATED!');
        }

        return {
            isSuccess: false,
            currentTier: this.sessionState.currentTier,
            isInRescueMode: this.sessionState.isInRescueMode,
            consecutiveErrors: this.sessionState.consecutiveErrors,
            clickedWrong: clickedEntity
        };
    }

    // Check for timeout (child is stuck)
    checkTimeout() {
        const timeSinceLastInteraction = Date.now() - this.sessionState.lastInteractionTime;
        if (timeSinceLastInteraction > TIMEOUT_THRESHOLD_MS) {
            // Downgrade tier on timeout
            if (this.sessionState.currentTier > 1) {
                this.sessionState.currentTier--;
            }
            this.sessionState.lastInteractionTime = Date.now();
            return {
                isTimeout: true,
                currentTier: this.sessionState.currentTier,
                shouldRescue: this.sessionState.currentTier === 1
            };
        }
        return { isTimeout: false };
    }

    // Get current scaffold tier
    getCurrentTier() {
        return this.sessionState.currentTier;
    }

    // Check if in rescue mode (need direct help)
    isInRescueMode() {
        return this.sessionState.isInRescueMode;
    }

    // Reset session state for new game
    resetSession() {
        this.sessionState = {
            currentTarget: null,
            consecutiveErrors: 0,
            lastInteractionTime: Date.now(),
            currentTier: 4,
            isInRescueMode: false
        };
    }

    // Get entities that need more practice for a level
    getEntitiesNeedingPractice(level, allEntities) {
        const needsPractice = [];
        for (const entity of allEntities) {
            const score = this.getMasteryScore(entity, level);
            if (score < 0.7) {
                needsPractice.push({ entity, score });
            }
        }
        // Sort by lowest mastery first
        needsPractice.sort((a, b) => a.score - b.score);
        return needsPractice.map(e => e.entity);
    }

    // Check if level is mastered
    isLevelMastered(level, allEntities, threshold = 0.7) {
        for (const entity of allEntities) {
            if (this.getMasteryScore(entity, level) < threshold) {
                return false;
            }
        }
        return true;
    }
}

// Singleton instance
export const scaffoldingManager = new ScaffoldingManager();
export default scaffoldingManager;
