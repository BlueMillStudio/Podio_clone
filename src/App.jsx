import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/employee-network" element={<div>Employee Network</div>} />
          <Route path="/demo-workspace" element={<div>Demo Workspace</div>} />
          <Route path="/intranet" element={<div>Intranet</div>} />
          <Route path="/project-management" element={<div>Project Management</div>} />
          <Route path="/sales-management" element={<div>Sales Management</div>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;