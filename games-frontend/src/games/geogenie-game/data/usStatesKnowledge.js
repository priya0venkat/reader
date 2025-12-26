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
        tier4Hints: ["It sticks out into the ocean like a thumb!", "Home of Disney World and alligators.", "The sunshine state!"],
        tier3Hints: ["Look for the long piece at the bottom right.", "It points down into the water."],
        tier2Hints: ["The shape pointing down.", "Bottom right corner."],
        funFact: [
            "Florida is the only state with both alligators and crocodiles!",
            "It is called the Sunshine State!",
            "Florida grows more oranges than any other state!",
            "Space rockets launch from Kennedy Space Center here!",
            "Manatees swim in the warm waters of Florida!"
        ]
    },
    "Texas": {
        shape: "big cowboy state",
        position: "bottom middle, very big",
        tier4Hints: ["The giant Cowboy State!", "It's huge and at the bottom.", "Famous for cowboys and BBQ!"],
        tier3Hints: ["The really big one at the bottom middle.", "Look for the biggest state you can see."],
        tier2Hints: ["The huge one at the bottom.", "The biggest piece."],
        funFact: [
            "Texas is so big, you can fit the whole world's population inside it!",
            "Its nickname is the Lone Star State!",
            "Cowboys and rodeos are very famous here!",
            "Texas is larger than the country of France!",
            "The Alamo is a famous historic fort in Texas!"
        ]
    },
    "California": {
        shape: "long state on the left edge",
        position: "left side, by the ocean",
        tier4Hints: ["The Golden State on the beach!", "Home to Hollywood and giant trees.", "A long sunny state on the left."],
        tier3Hints: ["The long curved one on the far left.", "Hugging the ocean on the left side."],
        tier2Hints: ["The long one on the left.", "The edge of the map."],
        funFact: [
            "California has trees taller than the Statue of Liberty!",
            "It is home to Hollywood, where movies are made!",
            "Death Valley is one of the hottest places on Earth!",
            "It produces more food than any other state!",
            "The Golden Gate Bridge is a famous red bridge here!"
        ]
    },
    "New York": {
        shape: "on the right side, top area",
        position: "top right, by the ocean",
        tier4Hints: ["Home of the Statue of Liberty!", "It has a giant city that never sleeps.", "Shaped like a triangle on top."],
        tier3Hints: ["Up near the top right corner.", "Next to the ocean on the right."],
        tier2Hints: ["Top right area.", "Look for the green Statue of Liberty."],
        funFact: [
            "New York City has a subway system with 472 stations!",
            "The Statue of Liberty stands in New York Harbor!",
            "Niagara Falls is a giant waterfall here!",
            "It is called the Empire State!",
            "The first capital of the US was New York City!"
        ]
    },
    "Alaska": {
        shape: "the huge one at the top left, separate",
        position: "top left corner, not connected",
        tier4Hints: ["The biggest, coldest state!", "It's way up north with polar bears.", "The huge piece all by itself."],
        tier3Hints: ["The giant one in the corner, separate from the others.", "Way up at the top left."],
        tier2Hints: ["The big lonely one.", "Top left corner."],
        funFact: [
            "Alaska has a longer coastline than all other US states combined!",
            "It is the largest state in the US!",
            "You can see the Northern Lights here!",
            "There are more than 3 million lakes in Alaska!",
            "Dog sledding is a popular sport here!"
        ]
    },
    "Hawaii": {
        shape: "island chain in the ocean",
        position: "bottom left, separate islands",
        tier4Hints: ["A chain of beautiful islands!", "It has volcanoes and surfing.", "Aloha! It's in the middle of the ocean."],
        tier3Hints: ["The tiny islands by themselves.", "Look for the dots in the water."],
        tier2Hints: ["The islands.", "The separate dots."],
        funFact: [
            "Hawaii is the only US state that grows coffee!",
            "It is made entirely of islands!",
            "Hawaii has active volcanoes that still erupt!",
            "The hula is a traditional Hawaiian dance!",
            "It is the only state with a royal palace!"
        ]
    },
    "Washington": {
        shape: "square-ish on top left corner",
        position: "very top left of mainland",
        tier4Hints: ["The rainy state in the top corner!", "Famous for apples and coffee.", "Named after George Washington."],
        tier3Hints: ["The very top left corner of the big map.", "Above California and Oregon."],
        tier2Hints: ["Top left corner.", "The corner piece."],
        funFact: [
            "Washington grows more apples than any other state!",
            "It is the only state named after a President!",
            "Seattle has a giant tower called the Space Needle!",
            "Mount Rainier is a volcano covered in ice!",
            "It is home to the first Starbucks coffee shop!"
        ]
    },
    "Michigan": {
        shape: "looks like a mitten",
        position: "middle top, by the big lakes",
        tier4Hints: ["It looks exactly like a mitten!", "Surrounded by Great Lakes.", "The hand-shaped state."],
        tier3Hints: ["Find the shape that looks like a hand.", "In the middle, near the water."],
        tier2Hints: ["The mitten shape.", "Looks like a hand."],
        funFact: [
            "You can use your hand to show people where you live in Michigan!",
            "It touches four of the five Great Lakes!",
            "Detroit is known as the Motor City for making cars!",
            "It has the longest freshwater coastline in the world!",
            "Michigan has more lighthouses than any other state!"
        ]
    },
    // SOUTHERN STATES
    "Alabama": {
        shape: "tall rectangle in the south",
        position: "bottom right area, next to Mississippi",
        tier4Hints: ["A tall state in the South.", "Famous for space rockets!", "Between Mississippi and Georgia."],
        tier3Hints: ["In the bottom row, next to the boot shape.", "Near Florida."],
        tier2Hints: ["At the bottom.", "Next to Georgia."],
        funFact: [
            "Alabama built the rocket that took people to the moon!",
            "It is the only state with all major resources to make iron and steel!",
            "Rosa Parks made history here on a bus!",
            "It is called the 'Heart of Dixie'!",
            "Alabama has lots of beautiful white sand beaches!"
        ]
    },
    "Georgia": {
        shape: "peach-shaped state",
        position: "southeast, above Florida",
        tier4Hints: ["The Peach State!", "It sits right on top of Florida.", "Famous for peaches and peanuts."],
        tier3Hints: ["Directly above the Florida handle.", "On the bottom right coast."],
        tier2Hints: ["Above Florida.", "Right side, bottom."],
        funFact: [
            "Georgia is the largest state east of the Mississippi River!",
            "It is the Peach State!",
            "The Coca-Cola drink was invented in Georgia!",
            "It hosted the 1996 Summer Olympics!",
            "Peanuts are a huge crop here!"
        ]
    },
    "Louisiana": {
        shape: "boot shape at the bottom",
        position: "bottom, by the Gulf",
        tier4Hints: ["It looks like a big boot!", "Famous for jazz music and Mardi Gras.", "The boot at the bottom."],
        tier3Hints: ["Look for the letter 'L' shape or a boot.", "Right at the bottom in the middle."],
        tier2Hints: ["The boot shape.", "At the bottom."],
        funFact: [
            "Louisiana is the only state shaped like a boot!",
            "New Orleans loves jazz music and Mardi Gras parades!",
            "It has lots of bayous with alligators!",
            "The state capital has a very tall tower!",
            "Tabasco hot sauce is made on an island here!"
        ]
    },
    "Mississippi": {
        shape: "tall and narrow",
        position: "south, named after the river",
        tier4Hints: ["Named after the mighty river!", "It enters the 'boot' state (Louisiana).", "A tall state with wiggly river borders."],
        tier3Hints: ["Next to the boot state (Louisiana).", "Tall and near the bottom."],
        tier2Hints: ["Next to the boot.", "In the south."],
        funFact: [
            "The teddy bear was invented in Mississippi!",
            "It is named after the mighty Mississippi River!",
            "Elvis Presley, the King of Rock and Roll, was born here!",
            "Catfish farming is huge in Mississippi!",
            "It has a coast on the Gulf of Mexico!"
        ]
    },
    "Tennessee": {
        shape: "long and skinny sideways",
        position: "stretches across the south",
        tier4Hints: ["The home of Country Music!", "A long, flat state.", "Nashville is here."],
        tier3Hints: ["The long flat one above Mississippi.", "Stretches from left to right."],
        tier2Hints: ["Long skinny one.", "Above the southern states."],
        funFact: [
            "Tennessee has more neighbors (8 states) than almost any other state!",
            "Nashville is the capital of country music!",
            "It has the Great Smoky Mountains!",
            "Elvis Presley's home, Graceland, is in Memphis!",
            "Tennessee is called the Volunteer State!"
        ]
    },
    "Kentucky": {
        shape: "wavy at the bottom",
        position: "east-central, above Tennessee",
        tier4Hints: ["Famous for fast horses and fried chicken!", "Shaped kind of like a chicken leg.", "Above Tennessee."],
        tier3Hints: ["Sitting on top of the long flat Tennessee.", "In the middle right."],
        tier2Hints: ["Above the long flat one.", "Middle area."],
        funFact: [
            "The world's longest cave system is in Kentucky!",
            "The Kentucky Derby is a famous horse race here!",
            "It is known as the Bluegrass State!",
            "Fried chicken is very popular here!",
            "Abraham Lincoln was born in a log cabin here!"
        ]
    },
    "Arkansas": {
        shape: "almost rectangular",
        position: "south-central",
        tier4Hints: ["The Natural State!", "It has diamonds you can dig up.", "Sounds like 'Kansas' but isn't."],
        tier3Hints: ["Sitting on top of the boot state (Louisiana).", "West of the Mississippi River."],
        tier2Hints: ["Above the boot.", "In the middle-south."],
        funFact: [
            "You can find real diamonds in the ground in Arkansas!",
            "It is called the Natural State because of its beauty!",
            "Hot Springs National Park has naturally hot water!",
            "Walmart started in Arkansas!",
            "It grows more rice than any other state!"
        ]
    },
    "South Carolina": {
        shape: "triangular-ish",
        position: "southeast coast",
        tier4Hints: ["Beautiful beaches and palm trees!", "Shaped like a slice of pizza.", "Next to the ocean."],
        tier3Hints: ["Below North Carolina.", "A triangle shape on the coast."],
        tier2Hints: ["On the right edge.", "Below the other Carolina."],
        funFact: [
            "South Carolina has a monkey colony on one of its islands!",
            "It was the first state to leave the Union in the Civil War!",
            "Sweet tea is very popular here!",
            "It has beautiful historic cities like Charleston!",
            "The Palmetto tree is its symbol!"
        ]
    },
    "North Carolina": {
        shape: "long and tilted",
        position: "southeast, on the coast",
        tier4Hints: ["First in Flight!", "The Wright Brothers flew their plane here.", "A long coastal state."],
        tier3Hints: ["Above South Carolina.", "Stretches out into the ocean."],
        tier2Hints: ["On the right coast.", "The upper Carolina."],
        funFact: [
            "North Carolina grows more sweet potatoes than any other state!",
            "The Wright Brothers flew the first airplane here!",
            "It has the tallest lighthouse in America!",
            "Legend says the pirate Blackbeard hid treasure here!",
            "It is home to the Great Smoky Mountains too!"
        ]
    },
    "Virginia": {
        shape: "shaped like a triangle pointing left",
        position: "mid-Atlantic coast",
        tier4Hints: ["Where many presidents were born!", "Next to the nation's capital.", "A triangle shape."],
        tier3Hints: ["Above North Carolina.", "On the right side."],
        tier2Hints: ["On the coast.", "Middle right."],
        funFact: [
            "8 US Presidents were born in Virginia!",
            "The Pentagon, a giant building, is here!",
            "The first English colony, Jamestown, was here!",
            "It is called the 'Mother of Presidents'!",
            "Shenandoah National Park has amazing views!"
        ]
    },
    // MIDWEST STATES
    "Ohio": {
        shape: "roundish with a bite taken out",
        position: "northeast of middle",
        tier4Hints: ["The shape of a heart!", "Home to many astronauts.", "Named after a river."],
        tier3Hints: ["Below the Great Lakes.", "Looks a bit like a heart."],
        tier2Hints: ["Middle right.", "Under the water."],
        funFact: [
            "50% of people in the US live within 500 miles of Ohio!",
            "It is the Birthplace of Aviation!",
            "Seven US Presidents were born in Ohio!",
            "The Rock and Roll Hall of Fame is here!",
            "Neil Armstrong, the first man on the moon, was from Ohio!"
        ]
    },
    "Indiana": {
        shape: "kind of rectangular",
        position: "midwest, next to Ohio",
        tier4Hints: ["Famous for the Indy 500 race cars!", "A tall rectangle shape.", "The Hoosier state."],
        tier3Hints: ["Next to the heart-shaped Ohio.", "A tall block."],
        tier2Hints: ["Next to Ohio.", "In the middle."],
        funFact: [
            "The Indy 500 is one of the most famous car races in the world!",
            "It is called the Hoosier State!",
            "Abraham Lincoln grew up here!",
            "A giant ball of paint in Indiana has over 25,000 layers!",
            "The town of Santa Claus receives thousands of letters every Christmas!"
        ]
    },
    "Illinois": {
        shape: "tall and narrow at bottom",
        position: "midwest, has Chicago",
        tier4Hints: ["Home of the windy city, Chicago!", "Tall state with a flat top.", "Lincoln lived here."],
        tier3Hints: ["Next to Indiana.", "Look for the tall state by the lake."],
        tier2Hints: ["Tall one in the middle.", "Next to the river."],
        funFact: [
            "The first McDonald's was built in Illinois!",
            "Chicago is called the Windy City!",
            "The Willis Tower in Chicago is one of the tallest buildings in the US!",
            "Abraham Lincoln lived here before becoming President!",
            "The world's largest bottle of catsup is here!"
        ]
    },
    "Wisconsin": {
        shape: "like a mitten facing right",
        position: "north-central, lots of cheese",
        tier4Hints: ["The Cheese State!", "Looks like a mitten for your left hand.", "Right next to the big lake."],
        tier3Hints: ["Above Illinois.", "Next to the water."],
        tier2Hints: ["Up north.", "The other mitten shape."],
        funFact: [
            "Wisconsin produces so much cheese, it's called 'America's Dairyland'!",
            "It hosts a giant cheese festival!",
            "The badger is the state animal!",
            "Harley-Davidson motorcycles started here!",
            "It has thousands of lakes formed by glaciers!"
        ]
    },
    "Minnesota": {
        shape: "has a funny bump at the top",
        position: "north-central",
        tier4Hints: ["Land of 10,000 Lakes!", "It has a little bump on top.", "Very snowy and cold."],
        tier3Hints: ["The one with the bump on its head.", "Top middle of the map."],
        tier2Hints: ["Top middle.", "Look for the bump."],
        funFact: [
            "Minnesota has one of the biggest malls in the world, the Mall of America!",
            "It is called the Land of 10,000 Lakes!",
            "The Mississippi River starts here!",
            "It gets very cold and snowy in winter!",
            "The honeycrisp apple was invented here!"
        ]
    },
    "Iowa": {
        shape: "like a face profile",
        position: "middle of the country",
        tier4Hints: ["Corn, corn, and more corn!", "Shaped like a profile of a face.", "In the middle of the US."],
        tier3Hints: ["Between the two big rivers.", "Under Minnesota."],
        tier2Hints: ["In the middle.", "Square-ish one."],
        funFact: [
            "There are more pigs than people in Iowa!",
            "It produces more corn than any other state!",
            "The state fair has a giant cow made of butter!",
            "It is the only state whose name starts with two vowels!",
            "Sliced bread was invented here!"
        ]
    },
    "Missouri": {
        shape: "boot heel at the bottom",
        position: "middle of the country",
        tier4Hints: ["Look for the little boot heel!", "Has a giant Gateway Arch.", "In the very middle."],
        tier3Hints: ["It has a tiny toe sticking out.", "Right in the center."],
        tier2Hints: ["Middle of the map.", "Next to Kansas."],
        funFact: [
            "The ice cream cone was invented in Missouri!",
            "The Gateway Arch in St. Louis is the tallest monument in the US!",
            "Mark Twain, a famous writer, grew up here!",
            "It is called the Show-Me State!",
            "Branson is famous for its music shows!"
        ]
    },
    // PLAINS STATES
    "Kansas": {
        shape: "rectangular",
        position: "middle of the country",
        tier4Hints: ["Where Dorothy and Toto are from!", "Perfectly rectangular with a bite taken out.", "The Sunflower State."],
        tier3Hints: ["The rectangle right in the middle.", "Where the Wizard of Oz started."],
        tier2Hints: ["Middle rectangle.", "Center of the map."],
        funFact: [
            "Kansas is flatter than a pancake!",
            "It is where Dorothy from The Wizard of Oz lived!",
            "It is the Sunflower State!",
            "Helium was discovered in Kansas!",
            "It produces a lot of wheat for bread!"
        ]
    },
    "Nebraska": {
        shape: "like a chimney at top",
        position: "great plains area",
        tier4Hints: ["Shaped like a cannon!", "Cornhuskers play football here.", "Lots of flat land."],
        tier3Hints: ["Sitting on top of Kansas.", "Has a handle on the left."],
        tier2Hints: ["Above Kansas.", "Middle area."],
        funFact: [
            "Kool-Aid was invented in Nebraska!",
            "It has the world's largest indoor rainforest!",
            "The mammoth is the state fossil!",
            "It is called the Cornhusker State!",
            "Arbor Day, the day for planting trees, started here!"
        ]
    },
    "Oklahoma": {
        shape: "has a panhandle",
        position: "south-central, above Texas",
        tier4Hints: ["Looks like a cooking pan!", "It sits just north of Texas.", "The Sooner State."],
        tier3Hints: ["The hat on Texas's head.", "It has a long handle sticking left."],
        tier2Hints: ["Above Texas.", "The pan shape."],
        funFact: [
            "The shopping cart was invented in Oklahoma!",
            "It has more man-made lakes than any other state!",
            "The parking meter was invented here too!",
            "It is called the Sooner State!",
            "Oklahoma has a large Native American population!"
        ]
    },
    "North Dakota": {
        shape: "rectangular",
        position: "top middle, by Canada",
        tier4Hints: ["A chilly rectangle at the top!", "Borders Canada.", "Famous for bison."],
        tier3Hints: ["The top rectangle in the middle.", "Above South Dakota."],
        tier2Hints: ["Very top edge.", "Middle left."],
        funFact: [
            "North Dakota holds the record for the most snow angels made at once!",
            "It grows the most sunflowers in the US!",
            "It is very cold in the winter!",
            "The geographical center of North America is here!",
            "It has a giant buffalo monument!"
        ]
    },
    "South Dakota": {
        shape: "rectangular",
        position: "north-central",
        tier4Hints: ["Home of Mount Rushmore!", "See the presidents carved in stone?", "A rectangle in the plains."],
        tier3Hints: ["Under North Dakota.", "The bottom of the two stacked rectangles."],
        tier2Hints: ["Below the top one.", "Middle plains."],
        funFact: [
            "It took 14 years to carve the faces on Mount Rushmore!",
            "The Badlands have amazing colorful rocks and fossils!",
            "Sue, the largest T-Rex ever found, was discovered here!",
            "It is the Coyote State!",
            "The Crazy Horse Memorial is being carved into a mountain here!"
        ]
    },
    // MOUNTAIN STATES
    "Montana": {
        shape: "big and flat on top",
        position: "northwest, by Canada",
        tier4Hints: ["Big Sky Country!", "It looks like a big face looking right.", "Mountains and bears."],
        tier3Hints: ["Huge state on the top border.", "West of the Dakotas."],
        tier2Hints: ["Top left-ish.", "Big state."],
        funFact: [
            "Montana has more cows than people!",
            "It is called Big Sky Country!",
            "Glacier National Park is here with beautiful mountains!",
            "The first T-Rex fossil was found in Montana!",
            "It is the 4th largest state by area!"
        ]
    },
    "Idaho": {
        shape: "weird shape with panhandle",
        position: "northwest",
        tier4Hints: ["The Potato State!", "Shaped like a thick letter 'L'.", "Lots of mountains."],
        tier3Hints: ["Next to Washington and Oregon.", "Tall and funny shaped."],
        tier2Hints: ["Northwest area.", "Next to the corner."],
        funFact: [
            "The deepest canyon in the US is in Idaho!",
            "It is famous for growing potatoes!",
            "It produces a lot of precious gems like garnets!",
            "Hell's Canyon is deeper than the Grand Canyon!",
            "It has a waterfall higher than Niagara Falls!"
        ]
    },
    "Wyoming": {
        shape: "perfect rectangle",
        position: "west, below Montana",
        tier4Hints: ["A perfect square shape!", "Home of Yellowstone Park.", "Cowboys and geysers."],
        tier3Hints: ["The square one in the mountains.", "Below Montana."],
        tier2Hints: ["The square.", "Middle west."],
        funFact: [
            "Wyoming was the first state to let women vote!",
            "It has the fewest people of all states!",
            "Yellowstone, the first national park, is mostly here!",
            "Old Faithful is a famous geyser that shoots hot water!",
            "Devil's Tower is a giant rock formation here!"
        ]
    },
    "Colorado": {
        shape: "perfect rectangle",
        position: "western middle",
        tier4Hints: ["The Rectangle State!", "Famous for skiing and mountains.", "The highest state."],
        tier3Hints: ["The other square state, below Wyoming.", "In the middle of the mountains."],
        tier2Hints: ["The rectangle.", "Below Wyoming."],
        funFact: [
            "Colorado has the highest city in the whole country!",
            "The Rocky Mountains are huge here!",
            "It has the highest paved road in North America!",
            "Denver is exactly one mile above sea level!",
            "The world's largest flat-top mountain is here!"
        ]
    },
    "Utah": {
        shape: "has a notch cut out",
        position: "west",
        tier4Hints: ["Shaped like a chair!", "Famous for arches and red rocks.", "Next to Colorado."],
        tier3Hints: ["Looks like a square with a corner missing.", "Next to Nevada."],
        tier2Hints: ["Square with a bite.", "Western state."],
        funFact: [
            "The Great Salt Lake is saltier than the ocean!",
            "It has five national parks with amazing red rocks!",
            "The 2002 Winter Olympics were held here!",
            "Arches National Park has over 2000 stone arches!",
            "The sea gull is the state bird!"
        ]
    },
    "Nevada": {
        shape: "wider at top, narrower at bottom",
        position: "west, next to California",
        tier4Hints: ["Home of Las Vegas!", "Lots of desert and mountains.", "Next to California."],
        tier3Hints: ["The pointy shape next to California.", "Between California and Utah."],
        tier2Hints: ["Next to the coast state.", "In the west."],
        funFact: [
            "Nevada is the driest state in the US!",
            "Las Vegas is famous for bright lights!",
            "The Hoover Dam is a giant dam here!",
            "It has more mountain ranges than any other state!",
            "Area 51 is a famous secret place in the desert here!"
        ]
    },
    "Arizona": {
        shape: "below Utah",
        position: "southwest",
        tier4Hints: ["The Grand Canyon State!", "Very hot and sunny.", "Lots of cactus grow here."],
        tier3Hints: ["Below Utah.", "Next to California at the bottom."],
        tier2Hints: ["Bottom left area.", "Next to Mexico."],
        funFact: [
            "Arizona has the most telescopes in the world!",
            "The Grand Canyon is one of the 7 Natural Wonders of the World!",
            "It gets super hot, but it can also snow in Flagstaff!",
            "The Saguaro cactus only grows here in the wild!",
            "Four Corners is where you can stand in 4 states at once!"
        ]
    },
    "New Mexico": {
        shape: "squarish",
        position: "southwest, below Colorado",
        tier4Hints: ["The Land of Enchantment!", "Beautiful deserts and balloons.", "Square with a tiny tail."],
        tier3Hints: ["Next to Arizona.", "Below Colorado."],
        tier2Hints: ["Bottom middle-left.", "Next to Texas."],
        funFact: [
            "The biggest hot air balloon festival is in New Mexico!",
            "It is called the Land of Enchantment!",
            "Carlsbad Caverns has a giant room called the Big Room!",
            "The roadrunner is the state bird!",
            "It has white sand dunes made of gypsum!"
        ]
    },
    // WEST COAST
    "Oregon": {
        shape: "almost rectangular",
        position: "northwest coast",
        tier4Hints: ["The Beaver State!", "Lots of green trees and rain.", "Below Washington."],
        tier3Hints: ["On the coast, between Washington and California.", "Left side of the map."],
        tier2Hints: ["On the left.", "The coast."],
        funFact: [
            "Oregon has the deepest lake in the US, Crater Lake!",
            "Nike was started in Oregon!",
            "It has the most ghost towns in the US!",
            "Crater Lake was formed by a collapsed volcano!",
            "The state flag has a different picture on the back!"
        ]
    },
    // NORTHEAST STATES
    "Maine": {
        shape: "shaped like a head",
        position: "very top right corner",
        tier4Hints: ["The top right corner piece!", "Famous for delicious lobsters.", "Lots of lighthouses."],
        tier3Hints: ["The very last state in the corner.", "Up at the top right."],
        tier2Hints: ["Top right corner.", "The pointy one."],
        funFact: [
            "Maine is the only state with one syllable!",
            "It is famous for catching delicious lobsters!",
            "It is the easternmost state in the US!",
            "90% of the country's toothpicks used to be made here!",
            "It has moose living in the forest!"
        ]
    },
    "New Hampshire": {
        shape: "tall and skinny",
        position: "northeast, below Maine",
        tier4Hints: ["The Granite State!", "Shaped like a pizza slice pointing up.", "Next to Maine."],
        tier3Hints: ["The triangle pointing up.", "Next to the top right corner."],
        tier2Hints: ["Up top.", "Next to Vermont."],
        funFact: [
            "The first potato in the US was planted here!",
            "It is the Granite State!",
            "Mount Washington has amazing wind!",
            "It was the first colony to declare independence!",
            "The state motto is 'Live Free or Die'!"
        ]
    },
    "Vermont": {
        shape: "tall and skinny",
        position: "northeast",
        tier4Hints: ["Maple syrup capital!", "Shaped like a 'V' for Vermont.", "Green Mountains."],
        tier3Hints: ["The V-shaped one.", "Next to New Hampshire."],
        tier2Hints: ["Next to New York.", "Up top."],
        funFact: [
            "Vermont has no billboards on its roads!",
            "It produces the most maple syrup in the US!",
            "Ben & Jerry's ice cream started here!",
            "It is the Green Mountain State!",
            "Vermont was a separate country before joining the US!"
        ]
    },
    "Massachusetts": {
        shape: "arm sticking out",
        position: "northeast coast",
        tier4Hints: ["It has a hook like a pirate!", "Where the Pilgrims landed.", "Boston is here."],
        tier3Hints: ["The state with the hook arm.", "Under New Hampshire."],
        tier2Hints: ["On the right coast.", "With the hook."],
        funFact: [
            "Basketball was invented in Massachusetts!",
            "The Pilgrims landed here at Plymouth Rock!",
            "Harvard is the oldest university in the US!",
            "Chocolate chip cookies were invented here!",
            "It is called the Bay State!"
        ]
    },
    "Rhode Island": {
        shape: "tiny",
        position: "northeast",
        tier4Hints: ["The smallest state!", "Tiny little dot.", "You have to look closely!"],
        tier3Hints: ["The tiniest piece of hold.", "Under Massachusetts."],
        tier2Hints: ["The smallest one.", "Hard to see."],
        funFact: [
            "Rhode Island is smaller than Yosemite National Park!",
            "It is the smallest state in the US!",
            "It is known as the Ocean State!",
            "The first diner was opened here!",
            "You can drive across the whole state in 45 minutes!"
        ]
    },
    "Connecticut": {
        shape: "small rectangle",
        position: "northeast",
        tier4Hints: ["Small rectangular state.", "Near New York City.", "The Constitution State."],
        tier3Hints: ["The squarish one below Massachusetts.", "Next to the tiny Rhode Island."],
        tier2Hints: ["In the cluster.", "Small rectangle."],
        funFact: [
            "The first hamburger was made in Connecticut!",
            "It is home to Yale University!",
            "The first color TV was made here!",
            "It is the Constitution State!",
            "ESPN, the sports channel, started here!"
        ]
    },
    "New Jersey": {
        shape: "small, by New York",
        position: "mid-Atlantic coast",
        tier4Hints: ["The Garden State!", "Famous for boardwalks and beaches.", "Nestled under New York."],
        tier3Hints: ["The curvy shape along the coast.", "Right next to Pennsylvania."],
        tier2Hints: ["On the coast.", "Small curvy one."],
        funFact: [
            "New Jersey has the most diners in the world!",
            "It is the Garden State!",
            "The light bulb was improved by Thomas Edison here!",
            "Salt water taffy was invented on the boardwalk here!",
            "It has the longest boardwalk in the world!"
        ]
    },
    "Pennsylvania": {
        shape: "rectangular",
        position: "northeast",
        tier4Hints: ["The Keystone State!", "Where the Liberty Bell lives.", "A big rectangle."],
        tier3Hints: ["The rectangle under New York.", "It touches Lake Erie."],
        tier2Hints: ["Big rectangle.", "Near the right side."],
        funFact: [
            "Hershey, Pennsylvania is the chocolate capital of the world!",
            "The Liberty Bell is in Philadelphia!",
            "The Declaration of Independence was signed here!",
            "It is the Keystone State!",
            "Mushrooms are grown here more than anywhere else!"
        ]
    },
    "Delaware": {
        shape: "tiny, second smallest",
        position: "mid-Atlantic",
        tier4Hints: ["The First State!", "It's tiny and on the side.", "Shaped like a shoe."],
        tier3Hints: ["The small thin one on the coast.", "Below Pennsylvania."],
        tier2Hints: ["Tiny one.", "On the edge."],
        funFact: [
            "Delaware has no sales tax!",
            "It was the first state to sign the Constitution!",
            "It is the second smallest state!",
            "Chickens outnumber people here!",
            "It is called the Diamond State!"
        ]
    },
    "Maryland": {
        shape: "weird crab shape",
        position: "mid-Atlantic",
        tier4Hints: ["Blue crabs and beaches!", "Strange wiggly shape.", "Sits on top of the capital."],
        tier3Hints: ["The squiggly one holding the bay.", "Above Virginia."],
        tier2Hints: ["Wiggly shape.", "Mid-Atlantic."],
        funFact: [
            "The National Anthem was written in Maryland!",
            "It is famous for blue crabs!",
            "The US Naval Academy is here!",
            "It has a weird shape because of the Chesapeake Bay!",
            "Jousting is the state sport!"
        ]
    },
    "West Virginia": {
        shape: "very bumpy edges",
        position: "mid-Atlantic",
        tier4Hints: ["Mountain Mama!", "It has very bumpy borders.", "Lots of coal mines."],
        tier3Hints: ["The bumpy one next to Virginia.", "In the mountains."],
        tier2Hints: ["Bumpy shape.", "Middle east."],
        funFact: [
            "West Virginia is the only state entirely in the mountains!",
            "It is called the Mountain State!",
            "Golden Delicious apples were discovered here!",
            "It has the New River Gorge Bridge, which is super high!",
            "Mother's Day started in West Virginia!"
        ]
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
