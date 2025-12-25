// World Map knowledge base for GeoGenie AI Tutor
// Uses Montessori color coding for continents

export const continentKnowledge = {
    "North America": {
        montessoriColor: "orange",
        colorHex: "#FF8C00",
        shape: "looks like a big triangle pointing down",
        position: "top left of the map",
        animals: ["bears", "eagles", "moose"],
        tier4Hints: ["where bears and eagles live", "has the USA and Canada"],
        tier3Hints: ["top left corner", "above South America"],
        tier2Hints: ["the orange one", "big one on the left"]
    },
    "South America": {
        montessoriColor: "pink",
        colorHex: "#FF69B4",
        shape: "looks like a big ice cream cone",
        position: "bottom left of the map",
        animals: ["parrots", "llamas", "monkeys"],
        tier4Hints: ["where parrots and monkeys live", "has the Amazon rainforest"],
        tier3Hints: ["below North America", "bottom left"],
        tier2Hints: ["the pink one", "cone shape at the bottom"]
    },
    "Europe": {
        montessoriColor: "red",
        colorHex: "#DC143C",
        shape: "small but has lots of countries",
        position: "top center-right of the map",
        animals: ["wolves", "deer", "foxes"],
        tier4Hints: ["many small countries", "has castles and knights"],
        tier3Hints: ["next to Asia", "above Africa"],
        tier2Hints: ["the red one", "smaller one in the middle-top"]
    },
    "Asia": {
        montessoriColor: "yellow",
        colorHex: "#FFD700",
        shape: "the biggest land mass",
        position: "right side of the map",
        animals: ["pandas", "tigers", "elephants"],
        tier4Hints: ["where pandas and tigers live", "the biggest continent"],
        tier3Hints: ["the huge one on the right", "biggest piece"],
        tier2Hints: ["the yellow one", "biggest land on the map"]
    },
    "Africa": {
        montessoriColor: "green",
        colorHex: "#228B22",
        shape: "big puzzle piece in the middle",
        position: "center of the map, below Europe",
        animals: ["lions", "elephants", "zebras", "giraffes"],
        tier4Hints: ["where lions and zebras live", "has the Sahara desert"],
        tier3Hints: ["in the middle", "below Europe, right of South America"],
        tier2Hints: ["the green one", "big piece in the center"]
    },
    "Australia": {
        montessoriColor: "brown",
        colorHex: "#8B4513",
        shape: "island at the bottom right",
        position: "bottom right corner",
        animals: ["kangaroos", "koalas", "platypus"],
        tier4Hints: ["where kangaroos hop", "koalas live there"],
        tier3Hints: ["all by itself at the bottom", "island continent"],
        tier2Hints: ["the brown one", "bottom right corner"]
    },
    "Antarctica": {
        montessoriColor: "white",
        colorHex: "#FFFFFF",
        shape: "snowy land at the very bottom",
        position: "very bottom of the map",
        animals: ["penguins", "seals"],
        tier4Hints: ["where penguins live", "super cold and icy"],
        tier3Hints: ["at the very bottom", "covered in snow"],
        tier2Hints: ["the white snowy one", "at the bottom"]
    }
};

// Ocean knowledge
export const oceanKnowledge = {
    "Pacific Ocean": {
        position: "biggest ocean, between Americas and Asia",
        tier4Hints: ["the biggest ocean", "between America and Asia"],
        tier3Hints: ["on the left side of the map", "huge blue area"],
        tier2Hints: ["the really big blue part"]
    },
    "Atlantic Ocean": {
        position: "between Americas and Europe/Africa",
        tier4Hints: ["between Americas and Europe", "ships cross it"],
        tier3Hints: ["in the middle of the map"],
        tier2Hints: ["blue water in the middle"]
    },
    "Indian Ocean": {
        position: "below Asia, east of Africa",
        tier4Hints: ["warm ocean near India", "below Asia"],
        tier3Hints: ["near Australia and Africa"],
        tier2Hints: ["the blue part near the brown continent"]
    },
    "Arctic Ocean": {
        position: "very top of the map",
        tier4Hints: ["frozen ocean at the top", "polar bears swim here"],
        tier3Hints: ["at the very top"],
        tier2Hints: ["the small blue part at the top"]
    },
    "Southern Ocean": {
        position: "around Antarctica",
        tier4Hints: ["around the penguin land", "cold water at the bottom"],
        tier3Hints: ["circling Antarctica"],
        tier2Hints: ["blue water at the very bottom"]
    }
};

export const getHint = (name, tier, isOcean = false) => {
    const knowledge = isOcean ? oceanKnowledge[name] : continentKnowledge[name];
    if (!knowledge) return `Look for ${name}!`;

    const hints = knowledge[`tier${tier}Hints`] || knowledge.tier2Hints;
    if (!hints) return `Find the ${knowledge.montessoriColor || ''} ${name}!`;

    return hints[Math.floor(Math.random() * hints.length)];
};

export const PHRASES = {
    correct: ["Great job!", "You found it!", "Wonderful!", "Amazing explorer!"],
    encouragement: ["Good try!", "Keep looking!", "You're doing great!"],
    levelComplete: "Wow! You know all the continents! You're a World Explorer!"
};
