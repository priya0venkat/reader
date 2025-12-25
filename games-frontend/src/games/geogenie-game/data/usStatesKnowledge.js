// US States knowledge base for GeoGenie AI Tutor
// Complete knowledge for all 50 states with child-friendly hints

export const statesList = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
    'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
    'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

// Shape metaphors and hints for all 50 states
export const stateKnowledge = {
    // EASY ANCHOR STATES
    "Florida": {
        shape: "a handle sticking into water",
        position: "bottom right, sticking out",
        tier4Hints: ["where Disney World is", "has alligators and oranges"],
        tier3Hints: ["the handle sticking into the ocean", "bottom right corner"],
        tier2Hints: ["looks like a handle or thumb", "pointing down into water"],
        funFact: "Florida has Disney World!"
    },
    "Texas": {
        shape: "big cowboy state",
        position: "bottom middle, very big",
        tier4Hints: ["where cowboys live", "the really big one"],
        tier3Hints: ["huge one at the bottom middle", "above Mexico"],
        tier2Hints: ["the really big one", "biggest state you can see"],
        funFact: "Texas is huge - everything is bigger there!"
    },
    "California": {
        shape: "long state on the left edge",
        position: "left side, by the ocean",
        tier4Hints: ["where movies are made", "has Disneyland"],
        tier3Hints: ["on the left edge by the ocean"],
        tier2Hints: ["long one on the left side", "by the Pacific"],
        funFact: "California has movie stars!"
    },
    "New York": {
        shape: "on the right side, top area",
        position: "top right, by the ocean",
        tier4Hints: ["has the Statue of Liberty", "big famous city"],
        tier3Hints: ["top right area", "by the ocean"],
        tier2Hints: ["on the right side up top"],
        funFact: "New York has really tall buildings!"
    },
    "Alaska": {
        shape: "the huge one at the top left, separate",
        position: "top left corner, not connected",
        tier4Hints: ["biggest state but shown separately", "super cold"],
        tier3Hints: ["all by itself at the top", "not connected"],
        tier2Hints: ["the big separate one", "way up top"],
        funFact: "Alaska is the biggest but very cold!"
    },
    "Hawaii": {
        shape: "island chain in the ocean",
        position: "bottom left, separate islands",
        tier4Hints: ["island paradise with volcanoes", "beaches"],
        tier3Hints: ["small islands by themselves"],
        tier2Hints: ["the little islands separate", "in the corner"],
        funFact: "Hawaii has real volcanoes!"
    },
    "Washington": {
        shape: "square-ish on top left corner",
        position: "very top left of mainland",
        tier4Hints: ["rains a lot there", "grows apples"],
        tier3Hints: ["top left corner of the main map"],
        tier2Hints: ["the corner piece at the top left"],
        funFact: "Washington has lots of rain!"
    },
    "Michigan": {
        shape: "looks like a mitten",
        position: "middle top, by the big lakes",
        tier4Hints: ["shaped like a mitten", "makes cars"],
        tier3Hints: ["surrounded by lakes", "looks like a glove"],
        tier2Hints: ["the mitten shape", "looks like a hand"],
        funFact: "Michigan looks like a mitten!"
    },
    // SOUTHERN STATES
    "Alabama": {
        shape: "tall rectangle in the south",
        position: "bottom right area, next to Mississippi",
        tier4Hints: ["known for football", "southern cooking"],
        tier3Hints: ["between Mississippi and Georgia"],
        tier2Hints: ["in the south", "above Florida"],
        funFact: "Alabama loves football!"
    },
    "Georgia": {
        shape: "peach-shaped state",
        position: "southeast, above Florida",
        tier4Hints: ["known for peaches", "has Atlanta"],
        tier3Hints: ["right above Florida", "on the east coast"],
        tier2Hints: ["above Florida", "by the ocean"],
        funFact: "Georgia grows lots of peaches!"
    },
    "Louisiana": {
        shape: "boot shape at the bottom",
        position: "bottom, by the Gulf",
        tier4Hints: ["shaped like a boot", "has jazz music"],
        tier3Hints: ["boot shape at the bottom"],
        tier2Hints: ["looks like a boot", "at the bottom"],
        funFact: "Louisiana has cool music!"
    },
    "Mississippi": {
        shape: "tall and narrow",
        position: "south, named after the river",
        tier4Hints: ["has a famous river", "starts with M"],
        tier3Hints: ["by the river with lots of S letters"],
        tier2Hints: ["in the south near Louisiana"],
        funFact: "The Mississippi River is huge!"
    },
    "Tennessee": {
        shape: "long and skinny sideways",
        position: "stretches across the south",
        tier4Hints: ["country music capital", "Nashville"],
        tier3Hints: ["long skinny one going sideways"],
        tier2Hints: ["stretches left to right", "in the south"],
        funFact: "Tennessee is the home of country music!"
    },
    "Kentucky": {
        shape: "wavy at the bottom",
        position: "east-central, above Tennessee",
        tier4Hints: ["famous for fried chicken", "horses"],
        tier3Hints: ["above Tennessee", "wavy bottom"],
        tier2Hints: ["above Tennessee"],
        funFact: "Kentucky has horse races!"
    },
    "Arkansas": {
        shape: "almost rectangular",
        position: "south-central",
        tier4Hints: ["sounds like Kansas but different"],
        tier3Hints: ["in the middle-south area"],
        tier2Hints: ["above Louisiana"],
        funFact: "Arkansas has beautiful lakes!"
    },
    "South Carolina": {
        shape: "triangular-ish",
        position: "southeast coast",
        tier4Hints: ["on the coast", "has beaches"],
        tier3Hints: ["below North Carolina", "by the ocean"],
        tier2Hints: ["on the right side", "near the coast"],
        funFact: "South Carolina has great beaches!"
    },
    "North Carolina": {
        shape: "long and tilted",
        position: "southeast, on the coast",
        tier4Hints: ["where first airplane flew", "mountains and beaches"],
        tier3Hints: ["above South Carolina"],
        tier2Hints: ["on the right side", "by the ocean"],
        funFact: "The first airplane flew here!"
    },
    "Virginia": {
        shape: "shaped like a triangle pointing left",
        position: "mid-Atlantic coast",
        tier4Hints: ["old historic state", "near Washington DC"],
        tier3Hints: ["next to the nation's capital"],
        tier2Hints: ["on the right side", "middle area"],
        funFact: "Virginia is very historic!"
    },
    // MIDWEST STATES
    "Ohio": {
        shape: "roundish with a bite taken out",
        position: "northeast of middle",
        tier4Hints: ["astronauts come from here", "has Cedar Point"],
        tier3Hints: ["below the Great Lakes"],
        tier2Hints: ["in the middle-right area"],
        funFact: "Many astronauts are from Ohio!"
    },
    "Indiana": {
        shape: "kind of rectangular",
        position: "midwest, next to Ohio",
        tier4Hints: ["famous for racing", "Indy 500"],
        tier3Hints: ["between Ohio and Illinois"],
        tier2Hints: ["in the middle"],
        funFact: "Indiana has big car races!"
    },
    "Illinois": {
        shape: "tall and narrow at bottom",
        position: "midwest, has Chicago",
        tier4Hints: ["has Chicago and deep dish pizza"],
        tier3Hints: ["the one with Chicago"],
        tier2Hints: ["in the middle", "gets narrow at bottom"],
        funFact: "Chicago has yummy pizza!"
    },
    "Wisconsin": {
        shape: "like a mitten facing right",
        position: "north-central, lots of cheese",
        tier4Hints: ["cheese state", "above Illinois"],
        tier3Hints: ["above Illinois", "by the lakes"],
        tier2Hints: ["north of Illinois"],
        funFact: "Wisconsin makes lots of cheese!"
    },
    "Minnesota": {
        shape: "has a funny bump at the top",
        position: "north-central",
        tier4Hints: ["land of 10000 lakes", "gets very cold"],
        tier3Hints: ["has bump at the very top"],
        tier2Hints: ["up north", "lots of lakes"],
        funFact: "Minnesota has tons of lakes!"
    },
    "Iowa": {
        shape: "like a face profile",
        position: "middle of the country",
        tier4Hints: ["grows lots of corn", "in the middle"],
        tier3Hints: ["between Minnesota and Missouri"],
        tier2Hints: ["in the middle"],
        funFact: "Iowa grows so much corn!"
    },
    "Missouri": {
        shape: "boot heel at the bottom",
        position: "middle of the country",
        tier4Hints: ["has a boot heel shape", "Gateway Arch"],
        tier3Hints: ["right in the middle of USA"],
        tier2Hints: ["in the middle of the map"],
        funFact: "Missouri has the Gateway Arch!"
    },
    // PLAINS STATES
    "Kansas": {
        shape: "rectangular",
        position: "middle of the country",
        tier4Hints: ["The Wizard of Oz", "very flat"],
        tier3Hints: ["rectangular one in the middle"],
        tier2Hints: ["rectangle in the middle"],
        funFact: "Dorothy from Wizard of Oz lives here!"
    },
    "Nebraska": {
        shape: "like a chimney at top",
        position: "great plains area",
        tier4Hints: ["has football", "Cornhuskers"],
        tier3Hints: ["above Kansas", "has chimney shape"],
        tier2Hints: ["above Kansas"],
        funFact: "Nebraska loves football!"
    },
    "Oklahoma": {
        shape: "has a panhandle",
        position: "south-central, above Texas",
        tier4Hints: ["shaped like a pan", "above Texas"],
        tier3Hints: ["has a handle part", "above Texas"],
        tier2Hints: ["above Texas", "has a long part"],
        funFact: "Oklahoma looks like a pan!"
    },
    "North Dakota": {
        shape: "rectangular",
        position: "top middle, by Canada",
        tier4Hints: ["cold winters", "near Canada"],
        tier3Hints: ["above South Dakota"],
        tier2Hints: ["at the top", "near Canada"],
        funFact: "North Dakota gets very cold!"
    },
    "South Dakota": {
        shape: "rectangular",
        position: "north-central",
        tier4Hints: ["has Mount Rushmore", "presidents' faces"],
        tier3Hints: ["below North Dakota"],
        tier2Hints: ["above Nebraska"],
        funFact: "Mt. Rushmore has giant faces!"
    },
    // MOUNTAIN STATES
    "Montana": {
        shape: "big and flat on top",
        position: "northwest, by Canada",
        tier4Hints: ["Big Sky Country", "mountains"],
        tier3Hints: ["big one by Canada on the left"],
        tier2Hints: ["up top on the left"],
        funFact: "Montana has amazing skies!"
    },
    "Idaho": {
        shape: "weird shape with panhandle",
        position: "northwest",
        tier4Hints: ["famous for potatoes"],
        tier3Hints: ["has a weird shape at top"],
        tier2Hints: ["in the northwest"],
        funFact: "Idaho grows lots of potatoes!"
    },
    "Wyoming": {
        shape: "perfect rectangle",
        position: "west, below Montana",
        tier4Hints: ["has Yellowstone", "perfect rectangle"],
        tier3Hints: ["the rectangle below Montana"],
        tier2Hints: ["the rectangle"],
        funFact: "Yellowstone Park is here!"
    },
    "Colorado": {
        shape: "perfect rectangle",
        position: "western middle",
        tier4Hints: ["has mountains", "rectangle shape"],
        tier3Hints: ["below Wyoming", "another rectangle"],
        tier2Hints: ["the rectangle below Wyoming"],
        funFact: "Colorado has big mountains!"
    },
    "Utah": {
        shape: "has a notch cut out",
        position: "west",
        tier4Hints: ["has red rocks", "notch shape"],
        tier3Hints: ["has a corner cut out"],
        tier2Hints: ["in the west", "next to Colorado"],
        funFact: "Utah has amazing red rocks!"
    },
    "Nevada": {
        shape: "wider at top, narrower at bottom",
        position: "west, next to California",
        tier4Hints: ["Las Vegas", "desert"],
        tier3Hints: ["next to California", "wide at top"],
        tier2Hints: ["next to California"],
        funFact: "Las Vegas is in Nevada!"
    },
    "Arizona": {
        shape: "below Utah",
        position: "southwest",
        tier4Hints: ["Grand Canyon", "very hot desert"],
        tier3Hints: ["below Utah", "above Mexico"],
        tier2Hints: ["in the southwest", "near California"],
        funFact: "The Grand Canyon is here!"
    },
    "New Mexico": {
        shape: "squarish",
        position: "southwest, below Colorado",
        tier4Hints: ["desert and chili peppers"],
        tier3Hints: ["below Colorado", "above Mexico"],
        tier2Hints: ["in the southwest"],
        funFact: "New Mexico has spicy food!"
    },
    // WEST COAST
    "Oregon": {
        shape: "almost rectangular",
        position: "northwest coast",
        tier4Hints: ["rainy and green", "below Washington"],
        tier3Hints: ["below Washington state"],
        tier2Hints: ["on the left", "below Washington"],
        funFact: "Oregon is very green!"
    },
    // NORTHEAST STATES
    "Maine": {
        shape: "shaped like a head",
        position: "very top right corner",
        tier4Hints: ["lobsters", "way up in the corner"],
        tier3Hints: ["very top right of the map"],
        tier2Hints: ["tippy top right corner"],
        funFact: "Maine has yummy lobsters!"
    },
    "New Hampshire": {
        shape: "tall and skinny",
        position: "northeast, below Maine",
        tier4Hints: ["small but mountainous"],
        tier3Hints: ["below Maine", "small"],
        tier2Hints: ["in the northeast corner"],
        funFact: "New Hampshire has pretty mountains!"
    },
    "Vermont": {
        shape: "tall and skinny",
        position: "northeast",
        tier4Hints: ["maple syrup", "small state"],
        tier3Hints: ["next to New Hampshire"],
        tier2Hints: ["small one in the northeast"],
        funFact: "Vermont makes maple syrup!"
    },
    "Massachusetts": {
        shape: "arm sticking out",
        position: "northeast coast",
        tier4Hints: ["Boston", "arm shape at Cape Cod"],
        tier3Hints: ["has arm sticking into ocean"],
        tier2Hints: ["in the northeast", "by the ocean"],
        funFact: "Boston is in Massachusetts!"
    },
    "Rhode Island": {
        shape: "tiny",
        position: "northeast",
        tier4Hints: ["smallest state", "teeny tiny"],
        tier3Hints: ["the tiniest one"],
        tier2Hints: ["super small", "easy to miss"],
        funFact: "Rhode Island is the smallest!"
    },
    "Connecticut": {
        shape: "small rectangle",
        position: "northeast",
        tier4Hints: ["small neat state"],
        tier3Hints: ["below Massachusetts"],
        tier2Hints: ["small one in the northeast"],
        funFact: "Connecticut is small but nice!"
    },
    "New Jersey": {
        shape: "small, by New York",
        position: "mid-Atlantic coast",
        tier4Hints: ["has beaches", "next to New York"],
        tier3Hints: ["right next to New York"],
        tier2Hints: ["small one by New York"],
        funFact: "New Jersey has great boardwalks!"
    },
    "Pennsylvania": {
        shape: "rectangular",
        position: "northeast",
        tier4Hints: ["Liberty Bell", "Philadelphia"],
        tier3Hints: ["below New York state"],
        tier2Hints: ["below New York"],
        funFact: "The Liberty Bell is here!"
    },
    "Delaware": {
        shape: "tiny, second smallest",
        position: "mid-Atlantic",
        tier4Hints: ["first state", "very small"],
        tier3Hints: ["tiny one below New Jersey"],
        tier2Hints: ["small one on the coast"],
        funFact: "Delaware was the first state!"
    },
    "Maryland": {
        shape: "weird crab shape",
        position: "mid-Atlantic",
        tier4Hints: ["crabs", "near DC"],
        tier3Hints: ["has weird shape", "near the capital"],
        tier2Hints: ["near Washington DC"],
        funFact: "Maryland loves crabs!"
    },
    "West Virginia": {
        shape: "very bumpy edges",
        position: "mid-Atlantic",
        tier4Hints: ["all mountains", "bumpy borders"],
        tier3Hints: ["has very bumpy edges"],
        tier2Hints: ["in the middle-right area"],
        funFact: "West Virginia is all mountains!"
    }
};

// Get hint for a state based on scaffold tier
export const getHint = (stateName, tier) => {
    const knowledge = stateKnowledge[stateName];
    if (!knowledge) return `Look for ${stateName}! It might be near the middle.`;

    const tierKey = `tier${tier}Hints`;
    const hints = knowledge[tierKey] || knowledge.tier2Hints || [`Look for ${stateName}`];

    return hints[Math.floor(Math.random() * hints.length)];
};

export const PHRASES = {
    correct: ["Amazing!", "You got it!", "Super smart!", "Great memory!", "Awesome!", "Fantastic!"],
    encouragement: ["Good try!", "Almost!", "Keep looking!", "You're close!", "Try again!"],
    levelComplete: "WOW! You're a US Geography Master! 🌟"
};
