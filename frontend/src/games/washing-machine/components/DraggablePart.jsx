import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export function DraggablePart({ id, label }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
    });
    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={`draggable-part part-${id}`}>
            {label}
        </div>
    );
}
