// North America knowledge base for GeoGenie AI Tutor
// Uses anthropomorphic mapping for easy memorization

export const countryKnowledge = {
    "Canada": {
        position: "the hat on top",
        flag: "🇨🇦",
        landmarks: ["maple leaf", "mountains", "moose"],
        tier4Hints: ["It's the giant hat on top of the USA!", "Home of maple syrup and moose!", "The big cold country way up north."],
        tier3Hints: ["Look for the huge country at the very top.", "It sits right on top of the USA."],
        tier2Hints: ["The big one on top.", "Top of the map."],
        funFact: "Canada has more lakes than all other countries combined!"
    },
    "United States": {
        position: "the face in the middle",
        flag: "🇺🇸",
        landmarks: ["stars and stripes", "Statue of Liberty", "Hollywood"],
        tier4Hints: ["The land of the free and home of the brave!", "It has 50 stars on its flag!", "The big country in the middle with Florida sticking out."],
        tier3Hints: ["The big one in the middle.", "Between Canada and Mexico."],
        tier2Hints: ["The middle country.", "Right in the center."],
        funFact: "The United States is home to the Grand Canyon!"
    },
    "Mexico": {
        position: "the beard at the bottom",
        flag: "🇲🇽",
        landmarks: ["eagle on cactus", "pyramids", "tacos"],
        tier4Hints: ["The land of tacos and pyramids!", "It looks like a beard under the USA.", "Look for the eagle on the flag."],
        tier3Hints: ["The country hanging below the USA.", "At the bottom of North America."],
        tier2Hints: ["The bottom one.", "Under the USA."],
        funFact: "Mexico introduced chocolate, corn, and chilies to the world!"
    },
    "Central America": {
        position: "the skinny part connecting North and South America",
        flag: "🌴",
        landmarks: ["rainforests", "volcanoes", "beaches"],
        tier4Hints: ["The skinny bridge to South America!", "It's full of rainforests and monkeys.", "A thin strip of land at the bottom."],
        tier3Hints: ["The wiggly tail at the bottom.", "Connecting North and South America."],
        tier2Hints: ["The skinny bottom part.", "The little tail."],
        funFact: "Central America has huge volcanoes and colorful birds!"
    },
    "The Caribbean": {
        position: "the islands in the ocean",
        flag: "🏝️",
        landmarks: ["beaches", "palm trees", "ocean"],
        tier4Hints: ["The splash of tropical islands!", "Pirates used to sail here.", "Lots of tiny islands in the blue sea."],
        tier3Hints: ["The dots in the ocean near Florida.", "Islands next to Mexico."],
        tier2Hints: ["The little islands.", "Dots in the water."],
        funFact: "The Caribbean has pink sand beaches on some islands!"
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
