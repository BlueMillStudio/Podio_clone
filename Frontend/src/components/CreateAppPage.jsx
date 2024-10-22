import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CreateAppModal from './CreateAppModal';
import CustomizeAppTemplate from './CustomizeAppTemplate';

const CreateAppPage = () => {
    const [step, setStep] = useState('initial');
    const [appData, setAppData] = useState(null);
    const { workspaceId } = useParams();
    const navigate = useNavigate();

    const handleCreateApp = async (data) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/apps`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    workspaceId,
                    name: data.appName,
                    itemName: data.itemName, // Include itemName
                    appType: data.appType,   // Include appType
                    appIcon: data.appIcon,   // Include appIcon
                    fields: [], // Empty fields array for now
                }),
            });

            if (response.ok) {
                const createdApp = await response.json();
                setAppData(createdApp.app);
                setStep('customize');
            } else {
                const errorData = await response.json();
                console.error('Error creating app:', errorData.message);
                alert(`Error creating app: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred while creating the app.');
        }
    };

    const handleSaveFields = async (fields) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/apps/${appData.id}/fields`, {
                method: 'PUT', // Changed from POST to PUT for updating fields
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ fields }),
            });

            if (response.ok) {
                // Navigate to the app details page after saving fields
                navigate(`/workspaces/${workspaceId}/apps/${appData.id}`);
            } else {
                const errorData = await response.json();
                console.error('Error saving fields:', errorData.message);
                alert(`Error saving fields: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred while saving fields.');
        }
    };

    const handleCancel = () => {
        navigate(`/workspaces/${workspaceId}/apps`);
    };

    return (
        <div>
            {step === 'initial' && (
                <CreateAppModal
                    isOpen={true}
                    onClose={handleCancel}
                    onCreateApp={handleCreateApp}
                />
            )}
            {step === 'customize' && appData && (
                <CustomizeAppTemplate
                    initialFields={[]} // Initially empty
                    onSave={handleSaveFields}
                    onCancel={handleCancel}
                    appId={appData.id}
                />
            )}
        </div>
    );
};

export default CreateAppPage;