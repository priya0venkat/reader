export const bundles = [
    {
        id: 'common-objects',
        title: 'Common Objects',
        description: 'Guess the object! Click to reveal the word.',
        mechanic: 'image-reveal', // 'image-reveal' or 'flip'
        cards: [
            { id: 'apple', front: '/assets/images/apple.png', back: 'Apple', phonetic: 'Ah Puh Puh Luh Eh, Apple' },
            { id: 'ball', front: '/assets/images/ball.png', back: 'Ball', phonetic: 'Buh Ah Luh Luh, Ball' },
            { id: 'cat', front: '/assets/images/cat.png', back: 'Cat', phonetic: 'Kuh Ah Tuh, Cat' },
            { id: 'dog', front: '/assets/images/dog.png', back: 'Dog', phonetic: 'Duh Aw Guh, Dog' },
            { id: 'car', front: '/assets/images/car.png', back: 'Car', phonetic: 'Kuh Ah Ruh, Car' },
            { id: 'bus', front: '/assets/images/bus.png', back: 'Bus', phonetic: 'Buh Uh Suh, Bus' },
            { id: 'flower', front: '/assets/images/flower.png', back: 'Flower', phonetic: 'Fuh Luh Ow Wuh Eh Ruh, Flower' },
            { id: 'house', front: '/assets/images/house.png', back: 'House', phonetic: 'Huh Ow Uh Suh Eh, House' },
            { id: 'hat', front: '/assets/images/hat.png', back: 'Hat', phonetic: 'Huh Ah Tuh, Hat' },
            { id: 'shoe', front: '/assets/images/shoe.png', back: 'Shoe', phonetic: 'Suh Huh Oh Eh, Shoe' },
        ]
    },
    {
        id: 'common-words',
        title: 'Common Words',
        description: 'Sight words for early readers.',
        mechanic: 'flip',
        cards: [
            { id: 'the', front: 'the', back: 'the' },
            { id: 'and', front: 'and', back: 'and' },
            { id: 'a', front: 'a', back: 'a' },
            { id: 'to', front: 'to', back: 'to' },
            { id: 'in', front: 'in', back: 'in' },
            { id: 'is', front: 'is', back: 'is' },
            { id: 'you', front: 'you', back: 'you' },
            { id: 'that', front: 'that', back: 'that' },
            { id: 'it', front: 'it', back: 'it' },
            { id: 'he', front: 'he', back: 'he' },
        ]
    }
];
