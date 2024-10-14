import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Calendar from "./components/Calendar";
import Connections from "./pages/Connections";
import Login from "./components/Login";
import Register from "./components/Register";
import Task from "./components/Task";
import VerifyEmail from "./components/VerifyEmail"; // New component
import ProfileCompletion from "./components/ProfileCompletion"; // New component
import AppBuilder from './components/AppBuilder';
import WorkspaceView from './components/WorkspaceView';
import AppList from './components/AppList';

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile-completion" element={<ProfileCompletion />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/connections" element={<Connections />} />
        <Route path="/task" element={<Task />} />

        {/* Workspace routes */}
        <Route path="/employee-network" element={<div>Employee Network</div>} />
        <Route path="/demo-workspace" element={<div>Demo Workspace</div>} />
        <Route path="/intranet" element={<div>Intranet</div>} />
        <Route path="/project-management" element={<div>Project Management</div>} />
        <Route path="/sales-management" element={<div>Sales Management</div>} />
        <Route path="/workspaces/:workspaceId" element={<WorkspaceView />} />
        <Route path="/workspaces/:workspaceId/apps" element={<AppList />} />
        <Route path="/workspaces/:workspaceId/apps/new" element={<AppBuilder />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;