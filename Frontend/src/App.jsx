import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Calendar from "./components/Calendar";
import Connections from "./pages/Connections";
import Login from "./components/Login";
import Register from "./components/Register";
import Task from "./components/Task";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/connections" element={<Connections />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/employee-network" element={<div>Employee Network</div>} />
        <Route path="/demo-workspace" element={<div>Demo Workspace</div>} />
        <Route path="/intranet" element={<div>Intranet</div>} />
        <Route path="/project-management" element={<div>Project Management</div>} />
        <Route path="/sales-management" element={<div>Sales Management</div>} />
        <Route path="/task" element={<Task />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
