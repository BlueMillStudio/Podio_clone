import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Calendar from "./components/Calendar";
import Connections from "./pages/Connections";
// import Settings from "./pages/Settings";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/connections" element={<Connections />} />
        {/* <Route path="/settings" element={<Settings />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;