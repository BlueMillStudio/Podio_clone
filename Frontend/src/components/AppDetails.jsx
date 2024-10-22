import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import AppNavBar from './AppNavBar';
import { Input } from '@/components/ui/input';

const AppDetails = () => {
    const { workspaceId, appId } = useParams();
    const [app, setApp] = useState(null);
    const [appFields, setAppFields] = useState([]);
    const [appItems, setAppItems] = useState([]);
    const [newItemData, setNewItemData] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [editItemData, setEditItemData] = useState({});
    const [currentEditItemId, setCurrentEditItemId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Fetch App Details
                const [appResponse, fieldsResponse, itemsResponse] = await Promise.all([
                    fetch(`http://localhost:5000/api/apps/${appId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }),
                    fetch(`http://localhost:5000/api/apps/${appId}/fields`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }),
                    fetch(`http://localhost:5000/api/apps/${appId}/items`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }),
                ]);

                if (appResponse.ok) {
                    const appData = await appResponse.json();
                    setApp(appData.app);
                } else {
                    const errorData = await appResponse.json();
                    setError(errorData.message || 'Failed to fetch app details');
                }

                if (fieldsResponse.ok) {
                    const fieldsData = await fieldsResponse.json();
                    setAppFields(fieldsData.fields);
                } else {
                    const errorData = await fieldsResponse.json();
                    setError(errorData.message || 'Failed to fetch app fields');
                }

                if (itemsResponse.ok) {
                    const itemsData = await itemsResponse.json();
                    setAppItems(itemsData.items);
                } else {
                    const errorData = await itemsResponse.json();
                    setError(errorData.message || 'Failed to fetch app items');
                }

                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError('An unexpected error occurred.');
                setLoading(false);
            }
        };

        fetchAppDetails();
    }, [appId, navigate]);

    const handleCustomize = () => {
        navigate(`/workspaces/${workspaceId}/apps/${appId}/customize`);
    };

    // Create Item Handlers
    const handleInputChange = (fieldName, value) => {
        setNewItemData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    const handleCreateItem = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/apps/${appId}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ data: newItemData }),
            });

            if (response.ok) {
                const data = await response.json();
                // Update the items list
                setAppItems((prevItems) => [...prevItems, data.item]);
                // Reset the form
                setNewItemData({});
                setShowForm(false);
            } else {
                const errorData = await response.json();
                console.error('Error creating item:', errorData.message);
                alert(`Error creating item: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred while creating the item.');
        }
    };

    // Edit Item Handlers
    const handleEditItem = (item) => {
        setEditItemData(item.data);
        setCurrentEditItemId(item.id);
        setIsEditFormOpen(true);
    };

    const handleEditInputChange = (fieldName, value) => {
        setEditItemData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    const handleUpdateItem = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/apps/${appId}/items/${currentEditItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ data: editItemData }),
            });

            if (response.ok) {
                const data = await response.json();
                // Update the items list
                setAppItems((prevItems) =>
                    prevItems.map((item) => (item.id === currentEditItemId ? data.item : item))
                );
                // Reset the form
                setEditItemData({});
                setCurrentEditItemId(null);
                setIsEditFormOpen(false);
            } else {
                const errorData = await response.json();
                console.error('Error updating item:', errorData.message);
                alert(`Error updating item: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred while updating the item.');
        }
    };

    // Delete Item Handler
    const handleDeleteItem = async (itemId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/apps/${appId}/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Remove the item from the state
                setAppItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
            } else {
                const errorData = await response.json();
                console.error('Error deleting item:', errorData.message);
                alert(`Error deleting item: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred while deleting the item.');
        }
    };

    if (loading) {
        return <div>Loading app details...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <>
            <AppNavBar />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{app.name}</h2>
                    <div className="flex space-x-2">
                        <Button onClick={() => setShowForm(true)} variant="default">
                            <Plus className="h-4 w-4 mr-1" /> Add Item
                        </Button>
                        <Button onClick={handleCustomize} variant="outline">
                            Customize App
                        </Button>
                    </div>
                </div>

                {/* Add Item Form */}
                {showForm && (
                    <div className="mb-6 p-4 border rounded bg-gray-50">
                        <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {appFields.map((field) => (
                                <div key={field.id}>
                                    <label className="block text-sm font-medium text-gray-700">{field.name}</label>
                                    <Input
                                        type="text"
                                        placeholder={`Enter ${field.name}`}
                                        value={newItemData[field.name] || ''}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={() => setShowForm(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateItem}>Add Item</Button>
                        </div>
                    </div>
                )}

                {/* Edit Item Form */}
                {isEditFormOpen && (
                    <div className="mb-6 p-4 border rounded bg-gray-50">
                        <h3 className="text-lg font-semibold mb-4">Edit Item</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {appFields.map((field) => (
                                <div key={field.id}>
                                    <label className="block text-sm font-medium text-gray-700">{field.name}</label>
                                    <Input
                                        type="text"
                                        placeholder={`Enter ${field.name}`}
                                        value={editItemData[field.name] || ''}
                                        onChange={(e) => handleEditInputChange(field.name, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={() => setIsEditFormOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateItem}>Update Item</Button>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                {appFields.map((field) => (
                                    <th
                                        key={field.id}
                                        className="px-4 py-2 border-b bg-gray-50 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
                                    >
                                        {field.name}
                                    </th>
                                ))}
                                <th className="px-4 py-2 border-b bg-gray-50"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {appItems.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                >
                                    {appFields.map((field) => (
                                        <td key={field.id} className="px-4 py-2 border-b text-sm text-gray-700">
                                            {item.data[field.name] || ''}
                                        </td>
                                    ))}
                                    <td className="px-4 py-2 border-b text-sm text-gray-700">
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditItem(item)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AppDetails;