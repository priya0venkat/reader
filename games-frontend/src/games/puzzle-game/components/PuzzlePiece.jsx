import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function PuzzlePiece({
    id,
    image,
    width,
    height,
    x, // target X on board (relative to board 0,0)
    y, // target Y on board
    boardWidth,
    boardHeight,
    currentX,
    currentY,
    shape = { top: 0, right: 0, bottom: 0, left: 0 },
    onDragEnd,
    isLocked
}) {
    const tabSize = Math.min(width, height) * 0.25 // 25% tab size
    const padding = tabSize // Enough padding to contain tabs

    // Total element size including padding
    const totalWidth = width + padding * 2
    const totalHeight = height + padding * 2

    // Generate Path relative to the PADDED box
    // The core rect starts at (padding, padding)
    const path = useMemo(() => {
        const { top, right, bottom, left } = shape

        const startX = padding
        const startY = padding
        const w = width
        const h = height
        const t = tabSize

        let d = `M${startX},${startY} `

        // Top
        if (top === 0) d += `L${startX + w},${startY} `
        else {
            const dir = -top
            d += `L${startX + w / 2 - t / 1.5},${startY} `
            // Bezier tab
            d += `C${startX + w / 2 - t},${startY + dir * t} ${startX + w / 2 + t},${startY + dir * t} ${startX + w / 2 + t / 1.5},${startY} `
            d += `L${startX + w},${startY} `
        }

        // Right
        if (right === 0) d += `L${startX + w},${startY + h} `
        else {
            const dir = right
            d += `L${startX + w},${startY + h / 2 - t / 1.5} `
            d += `C${startX + w + dir * t},${startY + h / 2 - t} ${startX + w + dir * t},${startY + h / 2 + t} ${startX + w},${startY + h / 2 + t / 1.5} `
            d += `L${startX + w},${startY + h} `
        }

        // Bottom
        if (bottom === 0) d += `L${startX},${startY + h} `
        else {
            const dir = bottom
            d += `L${startX + w / 2 + t / 1.5},${startY + h} `
            d += `C${startX + w / 2 + t},${startY + h + dir * t} ${startX + w / 2 - t},${startY + h + dir * t} ${startX + w / 2 - t / 1.5},${startY + h} `
            d += `L${startX},${startY + h} `
        }

        // Left
        if (left === 0) d += `Z `
        else {
            const dir = -left
            d += `L${startX},${startY + h / 2 + t / 1.5} `
            d += `C${startX + dir * t},${startY + h / 2 + t} ${startX + dir * t},${startY + h / 2 - t} ${startX},${startY + h / 2 - t / 1.5} `
            d += `Z `
        }

        return d
    }, [width, height, shape, padding, tabSize])

    return (
        <motion.div
            drag={!isLocked}
            dragMomentum={false}
            onDragEnd={(e, info) => onDragEnd(id, info)}

            animate={{
                x: currentX - padding, // Offset by padding because visual center is different
                y: currentY - padding,
                zIndex: isLocked ? 10 : 20,
                scale: isLocked ? 1 : 1.05
            }}

            whileDrag={{ zIndex: 50, scale: 1.1, cursor: 'grabbing' }}
            whileHover={!isLocked ? { scale: 1.1, zIndex: 40, cursor: 'grab' } : {}}

            className={`absolute ${isLocked ? 'shadow-none' : 'drop-shadow-lg'}`}
            style={{
                width: totalWidth,
                height: totalHeight,
                top: 0,
                left: 0,
            }}
        >
            <svg
                width={totalWidth}
                height={totalHeight}
                viewBox={`0 0 ${totalWidth} ${totalHeight}`}
                className="block"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    <clipPath id={`clip-${id}`}>
                        <path d={path} />
                    </clipPath>

                    {/* Skeuomorphic Bevel Filter */}
                    <filter id={`bevel-${id}`} x="-20%" y="-20%" width="140%" height="140%">
                        {/* 1. Blur alpha for height map */}
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />

                        {/* 2. Specular Highlight (Top-Left) */}
                        <feSpecularLighting in="blur" surfaceScale="6" specularConstant="1.5" specularExponent="12" lightingColor="white" result="specOut">
                            <fePointLight x="-5000" y="-5000" z="80" />
                        </feSpecularLighting>

                        {/* 3. Drop Shadow Offset (Bottom-Right) */}
                        <feOffset in="SourceAlpha" dx="2" dy="2" result="offsetAlpha" />
                        <feComposite in="offsetAlpha" in2="SourceAlpha" operator="out" result="shadowMask" />
                        <feFlood floodColor="#000" floodOpacity="0.5" result="shadowColor" />
                        <feComposite in="shadowColor" in2="shadowMask" operator="in" result="shadow" />

                        {/* Merge Highlight + Shadow */}
                        <feMerge>
                            <feMergeNode in="shadow" />
                            <feMergeNode in="specOut" />
                        </feMerge>

                        <feComposite in2="SourceAlpha" operator="in" result="bevel" />
                    </filter>
                </defs>

                {/* 1. Base Image, masked by puzzle shape */}
                <image
                    href={image}
                    x={-(x - padding)}
                    y={-(y - padding)}
                    width={boardWidth}
                    height={boardHeight}
                    clipPath={`url(#clip-${id})`}
                    preserveAspectRatio="none"
                />

                {/* 2. Bevel Overlay (Filter replaces the fill). Fill MUST be opaque for SourceAlpha to work. */}
                <path
                    d={path}
                    fill="black"
                    fillOpacity="1"
                    filter={`url(#bevel-${id})`}
                    style={{ pointerEvents: 'none' }}
                />

                {/* 3. Inner Stroke for definition */}
                <path
                    d={path}
                    fill="none"
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth="1"
                    style={{ pointerEvents: 'none' }}
                />
                {/* 4. Outer Stroke for highlight edge */}
                <path
                    d={path}
                    fill="none"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="0.5"
                    style={{ pointerEvents: 'none' }}
                />
            </svg>
        </motion.div>
    )
}
