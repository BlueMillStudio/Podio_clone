import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

const ItemForm = ({
    appFields,
    formType,
    currentItem,
    appId,
    setShowForm,
    setAppItems,
}) => {
    const [itemData, setItemData] = useState({});

    useEffect(() => {
        if (formType === 'edit' && currentItem) {
            setItemData(currentItem.data);
        } else {
            setItemData({});
        }
    }, [formType, currentItem]);

    const handleInputChange = (fieldName, value) => {
        setItemData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const url =
            formType === 'add'
                ? `http://localhost:5000/api/apps/${appId}/items`
                : `http://localhost:5000/api/apps/${appId}/items/${currentItem.id}`;
        const method = formType === 'add' ? 'POST' : 'PUT';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ data: itemData }),
            });

            if (response.ok) {
                const data = await response.json();
                setAppItems((prevItems) => {
                    if (formType === 'add') return [...prevItems, data.item];
                    return prevItems.map((item) =>
                        item.id === currentItem.id ? data.item : item
                    );
                });
                setShowForm(false);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred.');
        }
    };

    return (
        <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-md">
            <h3 className="text-2xl font-semibold mb-6">
                {formType === 'add' ? 'Add New Item' : 'Edit Item'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {appFields.map((field) => (
                    <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.name}
                        </label>
                        <Input
                            type="text"
                            placeholder={`Enter ${field.name}`}
                            value={itemData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full"
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-end mt-6 space-x-4">
                <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                >
                    {formType === 'add' ? 'Add Item' : 'Update Item'}
                </button>
            </div>
        </div>
    );
};

export default ItemForm;
