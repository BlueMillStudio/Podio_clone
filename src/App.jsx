import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Calendar from "./components/Calendar";
import Connections from "./pages/Connections";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Index />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/connections" element={<Connections />} />
        <Route path="/employee-network" element={<div>Employee Network</div>} />
        <Route path="/demo-workspace" element={<div>Demo Workspace</div>} />
        <Route path="/intranet" element={<div>Intranet</div>} />
        <Route path="/project-management" element={<div>Project Management</div>} />
        <Route path="/sales-management" element={<div>Sales Management</div>} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;