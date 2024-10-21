// frontend/src/components/WorkspaceLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavBar from './AppNavBar'; // Ensure the path is correct

const WorkspaceLayout = () => {
    return (
        <div>
            {/* Workspace-specific navbar */}
            <AppNavBar />
            {/* Render the matched child route */}
            <Outlet />
        </div>
    );
};

export default WorkspaceLayout;
