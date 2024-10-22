import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateAppModal from './CreateAppModal';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Activity,
    Briefcase,
    // Import other icons as needed
} from 'lucide-react';

const AppNavBar = () => {
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

                const response = await fetch(
                    `http://localhost:5000/api/apps/workspace/${workspaceId}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );


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

            const response = await fetch('http://localhost:5000/api/apps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    workspaceId: workspaceId,
                    name: appData.appName,
                    itemName: appData.itemName,
                    appType: appData.appType,
                    appIcon: appData.appIcon,
                    fields: [], // Include fields as an empty array
                }),

            });

            if (response.ok) {
                const data = await response.json();
                const createdApp = data.app;
                return createdApp;
            } else {
                const errorData = await response.json();
                console.error('Error creating app:', errorData.message);
                alert(`Error creating app: ${errorData.message}`);
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred while creating the app.');
            return null;
        }
    };

    const handleCreateApp = async (appData) => {
        const createdApp = await onAddApp(appData);
        if (createdApp && createdApp.id) {
            setIsModalOpen(false);
            navigate(`/workspaces/${workspaceId}/apps/${createdApp.id}/customize`);
            setApps((prevApps) => [...prevApps, createdApp]);
        }
    };

    const getAppIcon = (appIcon) => {
        switch (appIcon) {
            case 'ActivityIcon':
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
                                key={app.id}
                                variant="ghost"
                                className="flex flex-col items-center p-1 hover:bg-gray-300 text-gray-700"
                                onClick={() => {
                                    if (app.name.toLowerCase() === 'activity') {
                                        navigate(`/workspaces/${workspaceId}`);
                                    } else {
                                        navigate(`/workspaces/${workspaceId}/apps/${app.id}`);
                                    }
                                }}
                            >
                                {getAppIcon(app.app_icon)}
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