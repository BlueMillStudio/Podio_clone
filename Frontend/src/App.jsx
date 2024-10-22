import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Calendar from "./components/Calendar";
import Connections from "./pages/Connections";
import Login from "./components/Login";
import Register from "./components/Register";
import Task from "./components/Task";
import VerifyEmail from "./components/VerifyEmail";
import ProfileCompletion from "./components/ProfileCompletion";
import WorkspaceView from "./components/WorkspaceView";
import CreateAppPage from "./components/CreateAppPage";
import ActivityApp from "./components/ActivityApp";
import CustomizeAppTemplate from "./components/CustomizeAppTemplate";
import AppDetails from "./components/AppDetails";

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
        <Route path="/workspaces/:workspaceId" element={<WorkspaceView />} />
        <Route
          path="/workspaces/:workspaceId/apps/new"
          element={<CreateAppPage />}
        />
        <Route
          path="/workspaces/:workspaceId/apps/activity"
          element={<ActivityApp />}
        />
        <Route
          path="/workspaces/:workspaceId/apps/:appId/customize"
          element={<CustomizeAppTemplate />}
        />
        <Route
          path="/workspaces/:workspaceId/apps/:appId"
          element={<AppDetails />}
        />{" "}
        {/* Optional */}
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
