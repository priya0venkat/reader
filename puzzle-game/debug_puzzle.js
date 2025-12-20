
// Mock logic from PuzzleBoard and PuzzlePiece
const difficulty = 3;
const width = 300;
const height = 300;

// Logic from PuzzleBoard
const pieceW = width / difficulty;
const pieceH = height / difficulty;

const shapes = Array(difficulty).fill(0).map(() => Array(difficulty).fill(0).map(() => ({ top: 0, right: 0, bottom: 0, left: 0 })));

// Simulate rendering loop
console.log("\n--- Background Position Check ---");
const boardLeft = 100; // arbitrary
const boardTop = 50;

for (let row = 0; row < difficulty; row++) {
    for (let col = 0; col < difficulty; col++) {
        const targetX = boardLeft + col * pieceW;
        const targetY = boardTop + row * pieceH;

        // Props passed to PuzzlePiece
        const x = targetX - boardLeft;
        const y = targetY - boardTop;
        const padding = Math.min(pieceW, pieceH) * 0.25;

        const bgPos = `-${x - padding}px -${y - padding}px`;

        console.log(`Piece [${row},${col}]: x=${x}, y=${y}, bgPos=${bgPos}`);
    }
}

// Logic from PuzzlePiece
function getPath(width, height, shape) {
    const tabSize = Math.min(width, height) * 0.25;
    const padding = tabSize;

    // Total element size including padding (not used in path calc directly, path is relative to startX/Y)

    const startX = padding;
    const startY = padding;
    const w = width;
    const h = height;
    const t = tabSize;

    const { top, right, bottom, left } = shape;

    let d = `M${startX},${startY} `;

    // Top
    if (top === 0) d += `L${startX + w},${startY} `;
    else {
        const dir = -top;
        d += `L${startX + w / 2 - t / 1.5},${startY} `;
        d += `C${startX + w / 2 - t},${startY + dir * t} ${startX + w / 2 + t},${startY + dir * t} ${startX + w / 2 + t / 1.5},${startY} `;
        d += `L${startX + w},${startY} `;
    }

    // Right
    if (right === 0) d += `L${startX + w},${startY + h} `;
    else {
        const dir = right;
        d += `L${startX + w},${startY + h / 2 - t / 1.5} `;
        d += `C${startX + w + dir * t},${startY + h / 2 - t} ${startX + w + dir * t},${startY + h / 2 + t} ${startX + w},${startY + h / 2 + t / 1.5} `;
        d += `L${startX + w},${startY + h} `;
    }

    // Bottom
    if (bottom === 0) d += `L${startX},${startY + h} `;
    else {
        const dir = bottom;
        d += `L${startX + w / 2 + t / 1.5},${startY + h} `;
        d += `C${startX + w / 2 + t},${startY + h + dir * t} ${startX + w / 2 - t},${startY + h + dir * t} ${startX + w / 2 - t / 1.5},${startY + h} `;
        d += `L${startX},${startY + h} `;
    }

    // Left
    if (left === 0) d += `Z `;
    else {
        const dir = -left;
        d += `L${startX},${startY + h / 2 + t / 1.5} `;
        d += `C${startX + dir * t},${startY + h / 2 + t} ${startX + dir * t},${startY + h / 2 - t} ${startX},${startY + h / 2 - t / 1.5} `;
        d += `Z `;
    }

    return d;
}

// Generate Piece 0,0 and 0,1
const p1Shape = shapes[0][0]; // Right=1
const p2Shape = shapes[0][1]; // Left=-1

console.log("Piece 1 (0,0) Shape:", p1Shape);
console.log("Piece 2 (0,1) Shape:", p2Shape);

const path1 = getPath(pieceW, pieceH, p1Shape);
const path2 = getPath(pieceW, pieceH, p2Shape);

console.log("\nPath 1 (Right specific):");
console.log(path1);

console.log("\nPath 2 (Left specific):");
console.log(path2);
