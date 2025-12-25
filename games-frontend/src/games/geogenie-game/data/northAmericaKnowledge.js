// North America knowledge base for GeoGenie AI Tutor
// Uses anthropomorphic mapping for easy memorization

export const countryKnowledge = {
    "Canada": {
        position: "the hat on top",
        flag: "🇨🇦",
        landmarks: ["maple leaf", "mountains", "moose"],
        tier4Hints: ["where the maple leaf comes from", "very cold in winter", "has moose and bears"],
        tier3Hints: ["the hat on top of USA", "at the very top"],
        tier2Hints: ["the biggest one on top", "above the stars and stripes"],
        funFact: "Canada has more lakes than all other countries combined!"
    },
    "United States": {
        position: "the face in the middle",
        flag: "🇺🇸",
        landmarks: ["stars and stripes", "Statue of Liberty", "Hollywood"],
        tier4Hints: ["has the stars and stripes flag", "where Hollywood is", "50 states together"],
        tier3Hints: ["the middle country", "between Canada and Mexico"],
        tier2Hints: ["the big one in the middle", "under the maple leaf country"],
        funFact: "The United States has 50 states!"
    },
    "Mexico": {
        position: "the beard at the bottom",
        flag: "🇲🇽",
        landmarks: ["eagle on cactus", "pyramids", "tacos"],
        tier4Hints: ["where tacos come from", "has ancient pyramids", "eagle on their flag"],
        tier3Hints: ["the beard at the bottom", "below USA"],
        tier2Hints: ["at the bottom", "the smaller one under USA"],
        funFact: "Mexico has cool pyramids and yummy food!"
    },
    "Central America": {
        position: "the skinny part connecting North and South America",
        flag: "🌴",
        landmarks: ["rainforests", "volcanoes", "beaches"],
        tier4Hints: ["connecting bridge between continents", "has rainforests"],
        tier3Hints: ["below Mexico", "skinny strip of land"],
        tier2Hints: ["the thin part at the bottom", "connects to South America"],
        funFact: "Central America has beautiful rainforests and colorful birds!"
    },
    "The Caribbean": {
        position: "the islands in the ocean",
        flag: "🏝️",
        landmarks: ["beaches", "palm trees", "ocean"],
        tier4Hints: ["tropical islands", "surrounded by water", "pirate islands"],
        tier3Hints: ["islands near Florida", "in the blue ocean"],
        tier2Hints: ["the little islands", "dots in the water"],
        funFact: "The Caribbean has over 7,000 beautiful islands!"
    }
};

// Ordering for game - simple to harder
export const countriesList = ["Canada", "United States", "Mexico"];

export const getHint = (countryName, tier) => {
    const knowledge = countryKnowledge[countryName];
    if (!knowledge) return `Look for ${countryName}!`;

    const tierKey = `tier${tier}Hints`;
    const hints = knowledge[tierKey] || knowledge.tier2Hints;

    return hints[Math.floor(Math.random() * hints.length)];
};

// Visual anchor system - body metaphor
export const getBodyMetaphor = (countryName) => {
    switch (countryName) {
        case "Canada": return "Canada is the hat on top!";
        case "United States": return "USA is the face in the middle!";
        case "Mexico": return "Mexico is the beard at the bottom!";
        default: return "";
    }
};

export const PHRASES = {
    correct: ["Great job!", "You found it!", "Excellent!", "Super!"],
    encouragement: ["Good try!", "Almost there!", "Keep trying!"],
    levelComplete: "Amazing! You know North America! You're a Geography Star!"
};
