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
        funFact: [
            "Canada has more lakes than all other countries combined!",
            "Canada has the longest coastline in the world!",
            "The name Canada comes from the word 'Kanata', which meams village!",
            "It gets so cold in Canada that parts of the ocean can freeze!",
            "Beavers are a national symbol of Canada!"
        ]
    },
    "United States": {
        position: "the face in the middle",
        flag: "🇺🇸",
        landmarks: ["stars and stripes", "Statue of Liberty", "Hollywood"],
        tier4Hints: ["The land of the free and home of the brave!", "It has 50 stars on its flag!", "The big country in the middle with Florida sticking out."],
        tier3Hints: ["The big one in the middle.", "Between Canada and Mexico."],
        tier2Hints: ["The middle country.", "Right in the center."],
        funFact: [
            "The United States is home to the Grand Canyon!",
            "The American flag has 50 stars, one for each state!",
            "Millions of bison used to roam the plains of the USA!",
            "The USA put the first person on the moon!",
            "Yellowstone was the first National Park in the world!"
        ]
    },
    "Mexico": {
        position: "the beard at the bottom",
        flag: "🇲🇽",
        landmarks: ["eagle on cactus", "pyramids", "tacos"],
        tier4Hints: ["The land of tacos and pyramids!", "It looks like a beard under the USA.", "Look for the eagle on the flag."],
        tier3Hints: ["The country hanging below the USA.", "At the bottom of North America."],
        tier2Hints: ["The bottom one.", "Under the USA."],
        funFact: [
            "Mexico introduced chocolate, corn, and chilies to the world!",
            "Mexico City is built on top of a giant lake!",
            "The Chihuahua dog is named after a state in Mexico!",
            "Mexico has pyramids even bigger than the ones in Egypt!",
            "Millions of monarch butterflies fly to Mexico for the winter!"
        ]
    },
    "Central America": {
        position: "the skinny part connecting North and South America",
        flag: "🌴",
        landmarks: ["rainforests", "volcanoes", "beaches"],
        tier4Hints: ["The skinny bridge to South America!", "It's full of rainforests and monkeys.", "A thin strip of land at the bottom."],
        tier3Hints: ["The wiggly tail at the bottom.", "Connecting North and South America."],
        tier2Hints: ["The skinny bottom part.", "The little tail."],
        funFact: [
            "Central America has huge volcanoes and colorful birds!",
            "It's a bridge of land connecting North and South America!",
            "You can see both the Atlantic and Pacific oceans at the same time!",
            "Sloths live in the rainforest trees here!",
            "It's always warm because it's close to the equator!"
        ]
    },
    "The Caribbean": {
        position: "the islands in the ocean",
        flag: "🏝️",
        landmarks: ["beaches", "palm trees", "ocean"],
        tier4Hints: ["The splash of tropical islands!", "Pirates used to sail here.", "Lots of tiny islands in the blue sea."],
        tier3Hints: ["The dots in the ocean near Florida.", "Islands next to Mexico."],
        tier2Hints: ["The little islands.", "Dots in the water."],
        funFact: [
            "The Caribbean has pink sand beaches on some islands!",
            "It's made up of over 7000 islands!",
            "The water is crystal clear and full of coral reefs!",
            "It's famous for pirates who used to sail these seas!",
            "The world's smallest frog lives in the Caribbean!"
        ]
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
