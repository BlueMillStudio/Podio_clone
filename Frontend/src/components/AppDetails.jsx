import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table'; // Assuming you have a Table component
import { Edit, Trash2 } from 'lucide-react'; // Icons for actions

const AppDetails = () => {
    const { workspaceId, appId } = useParams();
    const [app, setApp] = useState(null);
    const [appFields, setAppFields] = useState([]);
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
                const appResponse = await fetch(`http://localhost:5000/api/apps/${appId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (appResponse.ok) {
                    const appData = await appResponse.json();
                    setApp(appData.app);
                } else {
                    const errorData = await appResponse.json();
                    setError(errorData.message || 'Failed to fetch app details');
                }

                // Fetch App Fields
                const fieldsResponse = await fetch(`http://localhost:5000/api/apps/${appId}/fields`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (fieldsResponse.ok) {
                    const fieldsData = await fieldsResponse.json();
                    setAppFields(fieldsData.fields);
                    setLoading(false);
                } else {
                    const errorData = await fieldsResponse.json();
                    setError(errorData.message || 'Failed to fetch app fields');
                    setLoading(false);
                }
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

    if (loading) {
        return <div>Loading app details...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{app.name}</h2>
                <Button onClick={handleCustomize} variant="outline">
                    Customize App
                </Button>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <thead>
                        <tr>
                            <th>Field Name</th>
                            <th>Field Type</th>
                            <th>Is Required</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appFields.map((field) => (
                            <tr key={field.id}>
                                <td>{field.name}</td>
                                <td>{field.field_type}</td>
                                <td>{field.is_required ? 'Yes' : 'No'}</td>
                                <td>
                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/workspaces/${workspaceId}/apps/${appId}/fields/${field.id}/edit`)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteField(field.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            {/* Add more app details or functionalities as needed */}
        </div>
    );
};

export default AppDetails;
