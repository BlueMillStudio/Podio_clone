import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppNavBar from './AppNavBar';
import ViewSelector from './ViewSelector';
import ItemForm from './ItemForm';
import ItemList from './ItemList';
import { Plus } from 'lucide-react';

const AppDetails = () => {
    const { workspaceId, appId } = useParams();
    const navigate = useNavigate();
    const [app, setApp] = useState(null);
    const [appFields, setAppFields] = useState([]);
    const [appItems, setAppItems] = useState([]);
    const [view, setView] = useState('table');
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState('add'); // 'add' or 'edit'
    const [currentItem, setCurrentItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const [appRes, fieldsRes, itemsRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/apps/${appId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`http://localhost:5000/api/apps/${appId}/fields`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`http://localhost:5000/api/apps/${appId}/items`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                if (appRes.ok) {
                    const appData = await appRes.json();
                    setApp(appData.app);
                } else {
                    const err = await appRes.json();
                    setError(err.message || 'Failed to fetch app details');
                }

                if (fieldsRes.ok) {
                    const fieldsData = await fieldsRes.json();
                    setAppFields(fieldsData.fields);
                } else {
                    const err = await fieldsRes.json();
                    setError(err.message || 'Failed to fetch app fields');
                }

                if (itemsRes.ok) {
                    const itemsData = await itemsRes.json();
                    setAppItems(itemsData.items);
                } else {
                    const err = await itemsRes.json();
                    setError(err.message || 'Failed to fetch app items');
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

    const handleFormOpen = (type, item = null) => {
        setFormType(type);
        setCurrentItem(item);
        setShowForm(true);
    };

    if (loading) return <div className="text-center mt-20">Loading app details...</div>;
    if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;

    return (
        <>
            <AppNavBar />
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">{app.name}</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleFormOpen('add')}
                            className="flex items-center bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
                        >
                            <Plus className="h-5 w-5 mr-2" /> Add Item
                        </button>
                        <button
                            onClick={handleCustomize}
                            className="flex items-center border border-teal-600 text-teal-600 px-4 py-2 rounded hover:bg-teal-50 transition"
                        >
                            Customize App
                        </button>
                    </div>
                </div>

                <ViewSelector view={view} setView={setView} />

                {showForm && (
                    <ItemForm
                        appFields={appFields}
                        formType={formType}
                        currentItem={currentItem}
                        appId={appId}
                        setShowForm={setShowForm}
                        setAppItems={setAppItems}
                    />
                )}

                <ItemList
                    appFields={appFields}
                    appItems={appItems}
                    view={view}
                    handleFormOpen={handleFormOpen}
                    setAppItems={setAppItems}
                    appId={appId}
                />
            </div>
        </>
    );
};

export default AppDetails;