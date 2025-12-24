import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export function DroppableZone({ id, children, className, placed }) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
        disabled: placed // Disable drop if already placed
    });

    const style = {
        borderColor: isOver ? 'green' : undefined,
        backgroundColor: isOver ? '#e0ffe0' : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} className={`droppable-zone ${className} ${placed ? 'placed' : ''}`}>
            {children}
        </div>
    );
}
