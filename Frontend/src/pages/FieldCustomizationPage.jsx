import React, { useState } from 'react';
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    rectIntersection,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// Field Types
const FieldTypes = [
    { id: 'text', label: 'Text' },
    { id: 'category', label: 'Category' },
    { id: 'date', label: 'Date' },
    { id: 'relationship', label: 'Relationship' },
    { id: 'member', label: 'Member' },
    { id: 'phone', label: 'Phone' },
    { id: 'email', label: 'Email' },
    { id: 'number', label: 'Number' },
    { id: 'link', label: 'Link' },
    { id: 'image', label: 'Image' },
];

// Field Item Component
const FieldItem = ({
    id,
    field,
    isEditable,
    onNameChange,
    listeners,
    attributes,
    setNodeRef,
    style,
}) => {
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className="mb-4">
                <CardContent className="flex items-center p-4">
                    <div className="cursor-move mr-2">☰</div>
                    {isEditable ? (
                        <Input
                            value={field.name}
                            onChange={(e) => onNameChange(id, e.target.value)}
                            className="mr-2"
                        />
                    ) : (
                        <span className="mr-2">{field.label}</span>
                    )}
                    <span className="text-sm text-gray-500">{field.label}</span>
                </CardContent>
            </Card>
        </div>
    );
};

// Draggable Item (Left Pane)
const DraggableItem = ({ id, field }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id,
        data: {
            field,
            from: 'availableFields',
        },
    });

    const style = {
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
    };

    return (
        <FieldItem
            id={id}
            field={field}
            isEditable={false}
            setNodeRef={setNodeRef}
            listeners={listeners}
            attributes={attributes}
            style={style}
        />
    );
};

// Sortable Item (Right Pane)
const SortableItem = ({ id, field, onNameChange }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id,
        data: {
            field,
            from: 'fields',
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
    };

    return (
        <FieldItem
            id={id}
            field={field}
            isEditable={true}
            onNameChange={onNameChange}
            setNodeRef={setNodeRef}
            listeners={listeners}
            attributes={attributes}
            style={style}
        />
    );
};

// Droppable Container
const DroppableContainer = ({ id, children, className }) => {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={className}>
            {children}
        </div>
    );
};

// Main Component
const FieldCustomizationPage = ({ onSave }) => {
    const [fields, setFields] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [activeField, setActiveField] = useState(null);
    const [activeFrom, setActiveFrom] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Optional: Adjusts drag sensitivity
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Handle Drag Start
    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
        setActiveField(active.data.current.field);
        setActiveFrom(active.data.current.from);
    };

    // Handle Drag Over
    const handleDragOver = (event) => {
        // No changes needed here
    };

    // Handle Drag End
    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);
        setActiveField(null);
        setActiveFrom(null);

        if (!over) {
            return;
        }

        const activeFrom = active.data.current.from;
        const overId = over.id;

        if (activeFrom === 'availableFields') {
            // Item dragged from left pane
            if (overId === 'fields' || fields.findIndex((f) => f.id === overId) !== -1) {
                // Dropped over the right pane or over an existing field in the right pane
                const newField = {
                    ...active.data.current.field,
                    id: `${active.id}-${Date.now()}`,
                    name: `New ${active.data.current.field.label}`,
                };
                setFields((prevFields) => {
                    // Insert at the correct position
                    const index = fields.findIndex((field) => field.id === overId);
                    if (index === -1) {
                        return [...prevFields, newField];
                    } else {
                        const newFields = [...prevFields];
                        newFields.splice(index, 0, newField);
                        return newFields;
                    }
                });
            }
        } else if (activeFrom === 'fields') {
            // Item dragged within right pane (reordering)
            if (overId) {
                const oldIndex = fields.findIndex((field) => field.id === active.id);
                const newIndex = fields.findIndex((field) => field.id === over.id);

                if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                    setFields((prevFields) => arrayMove(prevFields, oldIndex, newIndex));
                }
            }
        }
    };

    // Handle Name Change
    const handleNameChange = (id, newName) => {
        setFields((prevFields) =>
            prevFields.map((field) =>
                field.id === id ? { ...field, name: newName } : field
            )
        );
    };

    return (
        <div className="flex h-screen">
            <DndContext
                sensors={sensors}
                collisionDetection={rectIntersection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {/* Left Pane (Not Droppable) */}
                <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-4">Fields</h2>
                    {FieldTypes.map((field) => (
                        <DraggableItem key={field.id} id={field.id} field={field} />
                    ))}
                </div>

                {/* Right Pane (Droppable and Sortable) */}
                <DroppableContainer id="fields" className="flex-1 p-4 overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-4">Current Fields</h2>
                    <SortableContext
                        items={fields.map((field) => field.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {fields.map((field) => (
                            <SortableItem
                                key={field.id}
                                id={field.id}
                                field={field}
                                onNameChange={handleNameChange}
                            />
                        ))}
                    </SortableContext>
                </DroppableContainer>

                {/* Drag Overlay */}
                <DragOverlay>
                    {activeId && activeField ? (
                        <FieldItem
                            id={activeId}
                            field={
                                activeFrom === 'availableFields'
                                    ? { ...activeField, name: `New ${activeField.label}` }
                                    : activeField
                            }
                            isEditable={true}
                            listeners={null}
                            attributes={null}
                            setNodeRef={null}
                            style={{
                                cursor: 'move',
                                opacity: 0.8,
                            }}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Save Button */}
            <div className="fixed bottom-4 right-4">
                <Button onClick={() => onSave(fields)}>Save Fields</Button>
            </div>
        </div>
    );
};

export default FieldCustomizationPage;
