import { HomeIcon, Users, Briefcase, FileText, BarChart2 } from "lucide-react";
import Index from "./pages/Index.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Employee Network",
    to: "/employee-network",
    icon: <Users className="h-4 w-4" />,
    page: <div>Employee Network</div>,
  },
  {
    title: "Demo Workspace",
    to: "/demo-workspace",
    icon: <Briefcase className="h-4 w-4" />,
    page: <div>Demo Workspace</div>,
  },
  {
    title: "Intranet",
    to: "/intranet",
    icon: <FileText className="h-4 w-4" />,
    page: <div>Intranet</div>,
  },
  {
    title: "Project Management",
    to: "/project-management",
    icon: <BarChart2 className="h-4 w-4" />,
    page: <div>Project Management</div>,
  },
  {
    title: "Sales Management",
    to: "/sales-management",
    icon: <BarChart2 className="h-4 w-4" />,
    page: <div>Sales Management</div>,
  },
];