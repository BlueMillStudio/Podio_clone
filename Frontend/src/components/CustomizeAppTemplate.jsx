import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const availableFieldTypes = [
    { id: 'text', label: 'Text', icon: '📝' },
    { id: 'number', label: 'Number', icon: '🔢' },
    { id: 'date', label: 'Date', icon: '📅' },
    { id: 'category', label: 'Category', icon: '📂' },
];

const CustomizeAppTemplate = () => {
    const { workspaceId, appId } = useParams();
    const [availableFields, setAvailableFields] = useState([]);
    const [appFields, setAppFields] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppFields = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`http://localhost:5000/api/apps/${appId}/fields`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setAppFields(data.fields);
                    setAvailableFields(availableFieldTypes); // Initialize available fields
                    setIsLoading(false);
                } else {
                    const errorData = await response.json();
                    console.error('Error fetching app fields:', errorData.message);
                    setError(errorData.message || 'Failed to fetch app fields');
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error:', error);
                setError('An unexpected error occurred.');
                setIsLoading(false);
            }
        };

        fetchAppFields();
    }, [appId, navigate]);

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        // If dragging from available fields to app fields
        if (source.droppableId === 'availableFields' && destination.droppableId === 'appFields') {
            const fieldType = availableFields.find(field => field.id === draggableId);
            if (!fieldType) return;

            const newField = {
                id: Date.now().toString(), // Unique ID for the field in appFields
                name: `${fieldType.label} Field`,
                field_type: fieldType.id,
                is_required: false,
            };

            const newAppFields = Array.from(appFields);
            newAppFields.splice(destination.index, 0, newField);
            setAppFields(newAppFields);
            return;
        }

        // If reordering within app fields
        if (source.droppableId === 'appFields' && destination.droppableId === 'appFields') {
            const reorderedFields = Array.from(appFields);
            const [movedField] = reorderedFields.splice(source.index, 1);
            reorderedFields.splice(destination.index, 0, movedField);
            setAppFields(reorderedFields);
            return;
        }

        // Prevent dragging from appFields back to availableFields
        return;
    };

    const updateField = (id, key, value) => {
        setAppFields(fields =>
            fields.map(field => (field.id === id ? { ...field, [key]: value } : field))
        );
    };

    const removeField = (id) => {
        setAppFields(fields => fields.filter(field => field.id !== id));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/apps/${appId}/fields`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ fields: appFields }),
            });

            if (response.ok) {
                alert('App fields updated successfully!');
                navigate(`/workspaces/${workspaceId}/apps/${appId}`);
            } else {
                const errorData = await response.json();
                console.error('Error updating app fields:', errorData.message);
                alert(`Error updating app fields: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred while saving the fields.');
        }
    };


    if (isLoading) {
        return <div>Loading app fields...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-5xl bg-white p-6 rounded shadow">
                <h2 className="text-3xl font-bold mb-6">Customize App Fields</h2>
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex space-x-4">
                        {/* Available Fields Pane */}
                        <Droppable droppableId="availableFields" isDropDisabled={true}>
                            {(provided) => (
                                <div
                                    className="w-1/3 p-4 bg-gray-200 rounded"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h3 className="text-xl font-semibold mb-4">Available Fields</h3>
                                    {availableFields.map((field, index) => (
                                        <Draggable key={field.id} draggableId={field.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    className="flex items-center mb-2 p-2 bg-white rounded shadow cursor-pointer"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <span className="mr-2">{field.icon}</span>
                                                    <span>{field.label}</span>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                        {/* Current App Fields Pane */}
                        <Droppable droppableId="appFields">
                            {(provided) => (
                                <div
                                    className="w-2/3 p-4 bg-gray-200 rounded"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h3 className="text-xl font-semibold mb-4">App Fields</h3>
                                    {appFields.length === 0 && (
                                        <div className="text-gray-600">Drag fields here to add them to your app.</div>
                                    )}
                                    {appFields.map((field, index) => (
                                        <Draggable key={field.id} draggableId={field.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    className="flex items-center mb-2 p-2 bg-white rounded shadow"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <span className="mr-2">☰</span>
                                                    <div className="flex-1 mr-2">
                                                        <Label htmlFor={`field-name-${field.id}`} className="sr-only">
                                                            Field Name
                                                        </Label>
                                                        <Input
                                                            id={`field-name-${field.id}`}
                                                            placeholder="Field Name"
                                                            value={field.name}
                                                            onChange={(e) =>
                                                                updateField(field.id, 'name', e.target.value)
                                                            }
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mr-2">
                                                        <Label htmlFor={`field-type-${field.id}`} className="sr-only">
                                                            Field Type
                                                        </Label>
                                                        <select
                                                            id={`field-type-${field.id}`}
                                                            value={field.field_type}
                                                            onChange={(e) =>
                                                                updateField(field.id, 'field_type', e.target.value)
                                                            }
                                                            className="border p-2 rounded"
                                                            required
                                                        >
                                                            <option value="text">Text</option>
                                                            <option value="number">Number</option>
                                                            <option value="date">Date</option>
                                                            <option value="category">Category</option>
                                                            {/* Add more field types as needed */}
                                                        </select>
                                                    </div>
                                                    <div className="mr-2">
                                                        <Label
                                                            htmlFor={`field-required-${field.id}`}
                                                            className="flex items-center"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                id={`field-required-${field.id}`}
                                                                checked={field.is_required}
                                                                onChange={(e) =>
                                                                    updateField(
                                                                        field.id,
                                                                        'is_required',
                                                                        e.target.checked
                                                                    )
                                                                }
                                                                className="mr-1"
                                                            />
                                                            Required
                                                        </Label>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeField(field.id)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>
                <div className="flex justify-end space-x-4 mt-6">
                    <Button variant="outline" onClick={() => navigate(`/workspaces/${workspaceId}/apps/${appId}`)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Customization</Button>
                </div>
            </div>
        </div>
    );
};

export default CustomizeAppTemplate;