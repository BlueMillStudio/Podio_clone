import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CreateAppModal from './CreateAppModal';
import CustomizeAppTemplate from './CustomizeAppTemplate'; // Updated import

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

            const response = await fetch(`https://pp-tynr.onrender.com/api/apps`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    workspaceId,
                    name: data.appName,
                    fields: [],
                    icon: data.icon
                }),
            });

            if (response.ok) {
                const createdApp = await response.json();
                setAppData(createdApp.app); // Adjusted to get the 'app' from response
                setStep('customize');
            } else {
                const errorData = await response.json();
                console.error('Error creating app:', errorData.message);
                // Optionally set an error state to display to the user
            }
        } catch (error) {
            console.error('Error:', error);
            // Optionally set an error state to display to the user
        }
    };

    const handleSaveFields = async (fields) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`https://pp-tynr.onrender.com/api/apps/${appData.id}/fields`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ fields }),
            });

            if (response.ok) {
                // Navigate back to the app list
                navigate(`/workspaces/${workspaceId}/apps`);
            } else {
                const errorData = await response.json();
                console.error('Error saving fields:', errorData.message);
                // Optionally set an error state to display to the user
            }
        } catch (error) {
            console.error('Error:', error);
            // Optionally set an error state to display to the user
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
                    appId={appData.id} // Pass appId if needed
                />
            )}
        </div>
    );
};

export default CreateAppPage;
