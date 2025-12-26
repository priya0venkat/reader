// World Map knowledge base for GeoGenie AI Tutor
// Uses Montessori color coding for continents

export const continentKnowledge = {
    "North America": {
        montessoriColor: "orange",
        colorHex: "#FF8C00",
        shape: "looks like a big triangle pointing down",
        position: "top left of the map",
        animals: ["bears", "eagles", "moose"],
        tier4Hints: ["It's where bears, eagles, and moose live!", "Home to the USA, Canada, and Mexico.", "The big orange continent."],
        tier3Hints: ["Look for the orange piece at the top left.", "High up on the left side."],
        tier2Hints: ["The big orange one!", "Top left corner."],
        funFact: "North America has everything from frozen snow to hot deserts!"
    },
    "South America": {
        montessoriColor: "pink",
        colorHex: "#FF69B4",
        shape: "looks like a big ice cream cone",
        position: "bottom left of the map",
        animals: ["parrots", "llamas", "monkeys", "jaguars"],
        tier4Hints: ["Where colorful parrots and jaguars live!", "It has the giant Amazon rainforest.", "The pink continent shaped like an ice cream cone."],
        tier3Hints: ["Look below North America.", "The pink one at the bottom left."],
        tier2Hints: ["The pink one!", "Bottom left corner."],
        funFact: "The Amazon rainforest makes 20% of the world's oxygen!"
    },
    "Europe": {
        montessoriColor: "red",
        colorHex: "#DC143C",
        shape: "small but has lots of countries",
        position: "top center-right of the map",
        animals: ["wolves", "deer", "foxes"],
        tier4Hints: ["A red continent with many castles and kings!", "Attached to the big yellow Asia.", "Small but has lots of countries."],
        tier3Hints: ["The red piece in the middle, near the top.", "Above the green Africa."],
        tier2Hints: ["The red one!", "The small red piece."],
        funFact: "Europe has a city built entirely on water called Venice!"
    },
    "Asia": {
        montessoriColor: "yellow",
        colorHex: "#FFD700",
        shape: "the biggest land mass",
        position: "right side of the map",
        animals: ["pandas", "tigers", "elephants"],
        tier4Hints: ["The biggest continent of all!", "Home to giant pandas and tigers.", "The huge yellow land."],
        tier3Hints: ["The giant yellow piece on the right.", "Connected to the red Europe."],
        tier2Hints: ["The big yellow one!", "The biggest piece."],
        funFact: "Asia is so big, it has the highest mountain in the world!"
    },
    "Africa": {
        montessoriColor: "green",
        colorHex: "#228B22",
        shape: "big puzzle piece in the middle",
        position: "center of the map, below Europe",
        animals: ["lions", "elephants", "zebras", "giraffes"],
        tier4Hints: ["Where lions, giraffes, and elephants roam!", "It has the huge Sahara desert.", "The green continent in the middle."],
        tier3Hints: ["The big green piece in the center.", "Below the red Europe."],
        tier2Hints: ["The green one!", "Middle of the map."],
        funFact: "Africa has the longest river in the world, the Nile!"
    },
    "Australia": {
        montessoriColor: "brown",
        colorHex: "#8B4513",
        shape: "island at the bottom right",
        position: "bottom right corner",
        animals: ["kangaroos", "koalas", "platypus"],
        tier4Hints: ["Where kangaroos hop and koalas sleep!", "The island continent down under.", "The brown land all by itself."],
        tier3Hints: ["The brown island at the bottom right.", "All alone in the corner."],
        tier2Hints: ["The brown one!", "Bottom right corner."],
        funFact: "Australia has more kangaroos than people!"
    },
    "Antarctica": {
        montessoriColor: "white",
        colorHex: "#FFFFFF",
        shape: "snowy land at the very bottom",
        position: "very bottom of the map",
        animals: ["penguins", "seals", "whales"],
        tier4Hints: ["The frozen land of penguins!", "It's super cold and covered in ice.", "At the very bottom of the world."],
        tier3Hints: ["The white snowy land at the bottom.", "Way down at the bottom."],
        tier2Hints: ["The white one!", "The snowy bottom."],
        funFact: "Antarctica is the coldest place on Earth, colder than your freezer!"
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
