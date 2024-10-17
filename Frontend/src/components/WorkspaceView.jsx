import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import EmployeeNetwork from './EmployeeNetwork';
import ActivityApp from './ActivityApp';
import AppNavBar from './AppNavBar';
import {
  Activity,
  Users,
  Send,
  Lightbulb,
  Calendar,
  Briefcase,
} from 'lucide-react';

const WorkspaceView = () => {
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkspaceDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://pp-tynr.onrender.com/api/workspaces/${workspaceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setWorkspace(data.workspace);
          setApps(data.apps);
        } else {
          console.error("Error fetching workspace details:", data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    fetchWorkspaceDetails();
  }, [workspaceId]);

  if (loading) {
    return <div>Loading workspace details...</div>;
  }

  if (!workspace) {
    return <div>Error loading workspace details.</div>;
  }

  // Check if the workspace has an Activity App
  const activityApp = apps.find(app => app.name === 'Activity');

  // Check if workspace is Demo Workspace
  const isDemoWorkspace = workspace.name === 'Demo Workspace';

  // Define appNavItems based on workspace type
  let appNavItems = [];

  if (isDemoWorkspace) {
    // Demo Workspace: Include all default apps
    appNavItems = [
      { icon: <Activity className="h-5 w-5" />, label: 'Activity' },
      { icon: <Users className="h-5 w-5" />, label: 'Contacts' },
      { icon: <Send className="h-5 w-5" />, label: 'Projects' },
      { icon: <Lightbulb className="h-5 w-5" />, label: 'Ideas' },
      { icon: <Calendar className="h-5 w-5" />, label: 'Calendar' },
      { icon: <Briefcase className="h-5 w-5" />, label: 'Expenses' },
    ];
  } else {
    // Other Workspaces: Only Activity App
    appNavItems = [
      { icon: <Activity className="h-5 w-5" />, label: 'Activity' },
    ];
  }

  // Handler for adding a new app
  const handleAddApp = () => {
    navigate(`/workspaces/${workspaceId}/apps/new`);
  };

  // Determine which component to render
  if (activityApp) {
    return (
      <>
        <AppNavBar appNavItems={appNavItems} onAddApp={handleAddApp} />
        <ActivityApp workspace={workspace} />
      </>
    );
  } else {
    // Render EmployeeNetwork without AppNavBar
    return <EmployeeNetwork workspace={workspace} />;
  }
};

export default WorkspaceView;
