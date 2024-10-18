import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateAppModal from './CreateAppModal';
import { useNavigate, useParams } from 'react-router-dom';
import { Activity, Briefcase } from 'lucide-react';

const AppNavBar = ({ appNavItems }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { workspaceId } = useParams();

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`https://pp-tynr.onrender.com:/api/apps/workspace/${workspaceId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setApps(data.apps);
                    setLoading(false);
                } else {
                    const errorData = await response.json();
                    console.error('Error fetching apps:', errorData.message);
                    setError(errorData.message || 'Failed to fetch apps');
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error:', err);
                setError('An unexpected error occurred while fetching apps.');
                setLoading(false);
            }
        };

        fetchApps();
    }, [workspaceId, navigate]);

    const onAddApp = async (appData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return null;
            }

            const response = await fetch('https://pp-tynr.onrender.com/api/apps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    workspaceId: workspaceId,
                    name: appData.appName,
                    fields: [
                        {
                            name: appData.itemName, // Assuming itemName maps to a field
                            field_type: 'text', // Default field type; adjust as needed
                            is_required: true, // Adjust based on your requirements
                        },
                        // Add more fields if necessary
                    ],
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const createdApp = data.app; // Ensure your backend returns the created app with its id
                return createdApp;
            } else {
                const errorData = await response.json();
                console.error('Error creating app:', errorData.message);
                // Optionally, display error message to the user
                alert(`Error creating app: ${errorData.message}`);
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
            // Optionally, display error message to the user
            alert('An unexpected error occurred while creating the app.');
            return null;
        }
    };

    const handleCreateApp = async (appData) => {
        const createdApp = await onAddApp(appData);
        if (createdApp && createdApp.id) {
            setIsModalOpen(false); // Close the modal
            // Navigate to CustomizeAppTemplate page with the new appId
            navigate(`/workspaces/${workspaceId}/apps/${createdApp.id}/customize`);
            // Optionally, update the apps list to include the newly created app
            setApps((prevApps) => [...prevApps, createdApp]);
        } else {
            // Handle creation failure if necessary
            // The error has already been handled in onAddApp
        }
    };

    const getAppIcon = (appName) => {
        // Return different icons based on the app name
        switch (appName.toLowerCase()) {
            case 'activity':
                return <Activity className="h-5 w-5" />;
            case 'briefcase':
                return <Briefcase className="h-5 w-5" />;
            default:
                return <Briefcase className="h-5 w-5" />;
        }
    };

    if (loading) {
        return <div>Loading apps...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <>
            <nav className="bg-gray-200 py-2 px-4 border-b border-gray-300">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex space-x-4">
                        {apps.map((app) => (
                            <Button
                                variant="ghost"
                                className="flex flex-col items-center p-1 hover:bg-gray-300 text-gray-700"
                                onClick={() => navigate(`/workspaces/${workspaceId}/apps/${app.id}`)}
                            >
                                {getAppIcon(app.name)}
                                <span className="text-xs mt-1">{app.name}</span>
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-teal-600 border-teal-600 hover:bg-teal-50"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus className="h-4 w-4 mr-1" /> ADD APP
                    </Button>
                </div>
            </nav>
            <CreateAppModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreateApp={handleCreateApp}
            />
        </>
    );
};

export default AppNavBar;
