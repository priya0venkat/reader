// Solar System knowledge base for GeoGenie AI Tutor
// Designed for 5-year-olds with child-friendly descriptors

export const PLANETS = [
    { name: 'Sun', color: '#FDB813', size: 120, type: 'star' },
    { name: 'Mercury', color: '#A5A5A5', size: 30, type: 'planet' },
    { name: 'Venus', color: '#E3BB76', size: 50, type: 'planet' },
    { name: 'Earth', color: '#22A6B3', size: 52, type: 'planet' },
    { name: 'Mars', color: '#DD4C3A', size: 40, type: 'planet' },
    { name: 'Jupiter', color: '#D9A066', size: 100, type: 'planet' },
    { name: 'Saturn', color: '#EAD6B8', size: 90, type: 'planet' },
    { name: 'Uranus', color: '#D1F2F8', size: 60, type: 'planet' },
    { name: 'Neptune', color: '#4b70dd', size: 58, type: 'planet' }
];

export const solarSystemKnowledge = {
    Mercury: {
        shape: "tiny grey ball",
        position: "closest to the Sun",
        tier4Hints: ["smallest planet", "closest to the Sun", "grey and tiny"],
        tier3Hints: ["right next to the Sun", "first planet from the Sun"],
        tier2Hints: ["tiny grey one", "smallest ball"],
        funFact: "Mercury is super fast!"
    },
    Venus: {
        shape: "bright yellow-orange ball",
        position: "second from the Sun",
        tier4Hints: ["super hot planet", "bright and cloudy"],
        tier3Hints: ["between Mercury and Earth", "second planet"],
        tier2Hints: ["yellowish bright one", "medium size, not grey"],
        funFact: "Venus is the hottest planet!"
    },
    Earth: {
        shape: "blue and green ball",
        position: "third from the Sun",
        tier4Hints: ["our home!", "has water and land", "where we live"],
        tier3Hints: ["after Venus", "has the moon"],
        tier2Hints: ["the blue one", "has green and blue colors"],
        funFact: "Earth is our home!"
    },
    Mars: {
        shape: "red ball",
        position: "fourth from the Sun",
        tier4Hints: ["the red planet", "robots explore it"],
        tier3Hints: ["after Earth", "smaller than Earth"],
        tier2Hints: ["the red one", "red colored ball"],
        funFact: "Mars has big volcanoes!"
    },
    Jupiter: {
        shape: "giant striped ball",
        position: "fifth from the Sun",
        tier4Hints: ["biggest planet", "has a red spot", "the Giant King"],
        tier3Hints: ["after Mars", "much bigger than the others"],
        tier2Hints: ["the huge one", "biggest ball with stripes"],
        funFact: "Jupiter is so big, all other planets could fit inside!"
    },
    Saturn: {
        shape: "ball with beautiful rings",
        position: "sixth from the Sun",
        tier4Hints: ["has rings like a hula hoop", "the ringed planet"],
        tier3Hints: ["after Jupiter", "second biggest"],
        tier2Hints: ["the one with rings", "wearing a hula hoop"],
        funFact: "Saturn's rings are made of ice and rock!"
    },
    Uranus: {
        shape: "pale blue-green ball",
        position: "seventh from the Sun",
        tier4Hints: ["tilted on its side", "ice giant"],
        tier3Hints: ["after Saturn", "far away"],
        tier2Hints: ["light bluish-green one", "pale colored"],
        funFact: "Uranus spins on its side!"
    },
    Neptune: {
        shape: "deep blue ball",
        position: "eighth from the Sun",
        tier4Hints: ["farthest planet", "super windy", "dark blue"],
        tier3Hints: ["last planet", "after Uranus"],
        tier2Hints: ["the dark blue one", "deep blue color"],
        funFact: "Neptune has the fastest winds!"
    }
};

// Get hint for a planet based on scaffold tier (4=hardest, 1=easiest)
export const getHint = (planetName, tier) => {
    const knowledge = solarSystemKnowledge[planetName];
    if (!knowledge) return `Look for ${planetName}!`;

    switch (tier) {
        case 4:
            return knowledge.tier4Hints[Math.floor(Math.random() * knowledge.tier4Hints.length)];
        case 3:
            return knowledge.tier3Hints[Math.floor(Math.random() * knowledge.tier3Hints.length)];
        case 2:
            return knowledge.tier2Hints[Math.floor(Math.random() * knowledge.tier2Hints.length)];
        case 1:
        default:
            return `I'm making it glow! Tap the glowing planet!`;
    }
};

// Common phrases for TTS
export const PHRASES = {
    correct: [
        "Good job!",
        "You found it!",
        "Awesome!",
        "That's right!",
        "You're so smart!"
    ],
    encouragement: [
        "Good try!",
        "Almost!",
        "Keep looking!",
        "You can do it!"
    ],
    levelComplete: "Wow! You found all the planets! You're a Space Explorer!"
};
