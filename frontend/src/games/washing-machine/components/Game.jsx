import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { DraggablePart } from './DraggablePart';
import { DroppableZone } from './DroppableZone';
import confetti from 'canvas-confetti';
import { playWashingMachineSound } from '../utils/audio';

const PARTS = [
    { id: 'drum', label: 'Drum' },
    { id: 'door', label: 'Door' },
    { id: 'panel', label: 'Control Panel' },
    { id: 'drawer', label: 'Detergent Drawer' },
];

export function Game() {
    const [placedParts, setPlacedParts] = useState([]);
    const [isWashing, setIsWashing] = useState(false);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8, // Require dragging 8px before starting
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 5,
            },
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id === over.id) {
            setPlacedParts((prev) => [...prev, active.id]);
        }
    };

    const handleStartWash = () => {
        setIsWashing(true);
        confetti();
        playWashingMachineSound();
        setTimeout(() => setIsWashing(false), 5000);
    };

    const handleReset = () => {
        setPlacedParts([]);
        setIsWashing(false);
    };

    const allPlaced = PARTS.every(p => placedParts.includes(p.id));

    return (
        <div className="game-container">
            <h1>Build the Washing Machine!</h1>

            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="game-area">
                    <div className="parts-tray">
                        <h2>Parts</h2>
                        {PARTS.map((part) => (
                            !placedParts.includes(part.id) && (
                                <DraggablePart key={part.id} id={part.id} label={part.label} />
                            )
                        ))}
                    </div>

                    <div className={`washing-machine-frame ${isWashing ? 'shaking' : ''}`}>
                        {/* Droppable Zones representing the machine structure */}
                        <div className="machine-body">
                            <DroppableZone id="panel" placed={placedParts.includes('panel')} className="zone-panel">
                                {placedParts.includes('panel') ? <div className="part-panel">🔘🔘🔘</div> : "Panel Here"}
                            </DroppableZone>

                            <div className="middle-section">
                                <DroppableZone id="drawer" placed={placedParts.includes('drawer')} className="zone-drawer">
                                    {placedParts.includes('drawer') ? <div className="part-drawer">🔲</div> : "Drawer"}
                                </DroppableZone>

                                <div className="center-assembly">
                                    <DroppableZone id="drum" placed={placedParts.includes('drum')} className="zone-drum">
                                        {placedParts.includes('drum') ? <div className={`part-drum ${isWashing ? 'spinning' : ''}`}>🌀</div> : "Drum Here"}
                                    </DroppableZone>

                                    {placedParts.includes('drum') && (
                                        <DroppableZone id="door" placed={placedParts.includes('door')} className="zone-door">
                                            {placedParts.includes('door') ? <div className="part-door">⭕</div> : "Door Here"}
                                        </DroppableZone>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DndContext>

            {allPlaced && (
                <button className="start-button" onClick={handleStartWash} disabled={isWashing}>
                    {isWashing ? "Washing..." : "Start Washing!"}
                </button>
            )}

            {placedParts.length > 0 && (
                <button className="reset-button" onClick={handleReset}>
                    Reset
                </button>
            )}
        </div>
    );
}
