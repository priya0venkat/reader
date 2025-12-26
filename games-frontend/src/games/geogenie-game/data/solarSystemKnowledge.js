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
        shape: "tiny grey rocky ball",
        position: "closest to the Sun",
        tier4Hints: ["It's the baby planet closest to the Sun!", "It's super hot and dusty!", "The smallest grey planet."],
        tier3Hints: ["Look for the tiny grey ball right next to the Sun.", "It's the very first planet!"],
        tier2Hints: ["Find the smallest grey ball.", "The tiny one touching the Sun."],
        funFact: [
            "Mercury zooms around the Sun faster than any other planet!",
            "It is the closest planet to the Sun!",
            "Mercury has wrinkles on its surface!",
            "It is the smallest planet in our solar system!",
            "A year on Mercury is only 88 days long!"
        ]
    },
    Venus: {
        shape: "bright yellow-orange ball",
        position: "second from the Sun",
        tier4Hints: ["It's the hottest planet of all!", "It hides under thick yellow clouds.", "Brighter than any star!"],
        tier3Hints: ["It's the yellow one next to Earth.", "The second planet from the Sun."],
        tier2Hints: ["The bright yellow ball.", "Find the one that looks like a yellow marble."],
        funFact: [
            "Venus spins backwards! The sun rises in the west there!",
            "It is the hottest planet in the solar system!",
            "Venus has mountains and volcanoes like Earth!",
            "It is named after the goddess of love and beauty!",
            "Venus is sometimes called Earth's twin sister!"
        ]
    },
    Earth: {
        shape: "blue and green marble",
        position: "third from the Sun",
        tier4Hints: ["It's our home!", "The only place with oceans and life.", "Look for the blue and green colors."],
        tier3Hints: ["It's the third planet, where we live!", "Find the blue and green ball."],
        tier2Hints: ["The blue and green one.", "Our beautiful home planet."],
        funFact: [
            "Earth is the only planet with chocolate and puppies!",
            "It is mostly covered by water!",
            "Earth is the only planet known to have life!",
            "It takes 365 days for Earth to go around the Sun!",
            "Earth has one moon that lights up our night sky!"
        ]
    },
    Mars: {
        shape: "dusty red ball",
        position: "fourth from the Sun",
        tier4Hints: ["The Red Planet!", "It has giant volcanoes and red dust.", "Robots are exploring it right now!"],
        tier3Hints: ["Look for the rusty red ball.", "It's the red one next to Earth."],
        tier2Hints: ["The small red one.", "Find the red planet."],
        funFact: [
            "Mars has a volcano three times bigger than Everest!",
            "It is called the Red Planet because of rusty dust!",
            "Mars has two tiny moons shaped like potatoes!",
            "Scientists send robots called rovers to explore Mars!",
            "It has the largest canyon in the solar system!"
        ]
    },
    Jupiter: {
        shape: "giant striped ball",
        position: "fifth from the Sun",
        tier4Hints: ["The King of Planets!", "It has a Great Red Spot storm.", "It's the biggest one of all!"],
        tier3Hints: ["The giant one with stripes.", "It's huge and sandy colored."],
        tier2Hints: ["The biggest planet.", "The giant striped ball."],
        funFact: [
            "Jupiter is a gas giant - you couldn't stand on it!",
            "It is the largest planet in our solar system!",
            "Jupiter has a Great Red Spot that is a giant storm!",
            "It spins faster than any other planet!",
            "Jupiter has at least 79 moons!"
        ]
    },
    Saturn: {
        shape: "ball with beautiful rings",
        position: "sixth from the Sun",
        tier4Hints: ["It has the most beautiful rings!", "The jewel of the solar system.", "A big yellow ball with a hula hoop!"],
        tier3Hints: ["Look for the planet with big rings.", "The one wearing a ring!"],
        tier2Hints: ["The one with the rings.", "Find the ringed planet."],
        funFact: [
            "Saturn's rings are made of ice chunks and space rocks!",
            "It is the second largest planet!",
            "Saturn is so light it would float in a giant bathtub!",
            "It has the most spectacular rings of all planets!",
            "Saturn has a moon called Titan that is bigger than Mercury!"
        ]
    },
    Uranus: {
        shape: "pale blue-green ice giant",
        position: "seventh from the Sun",
        tier4Hints: ["The frozen ice giant!", "It rolls on its side like a ball.", "A cold, pale blue planet."],
        tier3Hints: ["The light blue one far away.", "It spins on its side!"],
        tier2Hints: ["The light blue-green one.", "The pale blue ball."],
        funFact: [
            "Uranus is the coldest planet in the whole neighborhood!",
            "It spins on its side like a rolling ball!",
            "Uranus was the first planet found using a telescope!",
            "It has 27 moons named after characters from plays!",
            "The planet is blue-green because of methane gas!"
        ]
    },
    Neptune: {
        shape: "deep blue windy ball",
        position: "eighth from the Sun",
        tier4Hints: ["The furthest planet from the Sun!", "A dark blue world with super fast winds.", "It's very cold and far away."],
        tier3Hints: ["The dark blue one at the end.", "The very last planet."],
        tier2Hints: ["The dark blue ball.", "The one furthest away."],
        funFact: [
            "It takes Neptune 165 years to go around the Sun just once!",
            "Neptune is the windiest planet, with supersonic winds!",
            "It is the farthest planet from the Sun!",
            "Neptune has a Great Dark Spot similar to Jupiter's!",
            "It is an ice giant, very cold and dark!"
        ]
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
