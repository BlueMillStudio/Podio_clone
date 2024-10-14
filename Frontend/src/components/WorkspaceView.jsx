import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const WorkspaceView = () => {
    const { workspaceId } = useParams();
    const [workspace, setWorkspace] = useState(null);
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkspaceDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`http://localhost:5000/api/workspaces/${workspaceId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setWorkspace(data.workspace);
                    setApps(data.apps);
                    setLoading(false);
                } else {
                    const errorData = await response.json();
                    console.error('Error fetching workspace details:', errorData.message);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchWorkspaceDetails();
    }, [workspaceId, navigate]);

    if (loading) {
        return <div>Loading workspace details...</div>;
    }

    if (!workspace) {
        return <div>Error loading workspace details.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-3xl font-bold mb-4">{workspace.name}</h1>
            {workspace.description && <p className="mb-6">{workspace.description}</p>}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Apps</h2>
                <Link
                    to={`/workspaces/${workspaceId}/apps/new`}
                    className="px-4 py-2 bg-teal-600 text-white rounded"
                >
                    Create New App
                </Link>
            </div>

            {apps.length === 0 ? (
                <p>No apps found in this workspace.</p>
            ) : (
                <ul className="space-y-4">
                    {apps.map((app) => (
                        <li key={app.id} className="border p-4 rounded">
                            <Link
                                to={`/workspaces/${workspaceId}/apps/${app.id}`}
                                className="text-xl font-semibold text-blue-600"
                            >
                                {app.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default WorkspaceView;
