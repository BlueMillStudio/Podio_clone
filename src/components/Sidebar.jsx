import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, FileText, BarChart2, Plus, X } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: <Users className="h-5 w-5" />, label: 'Employee Network', path: '/employee-network' },
    { icon: <Briefcase className="h-5 w-5" />, label: 'Demo Workspace', path: '/demo-workspace' },
    { icon: <FileText className="h-5 w-5" />, label: 'Intranet', path: '/intranet' },
    { icon: <BarChart2 className="h-5 w-5" />, label: 'Project Management', path: '/project-management' },
    { icon: <BarChart2 className="h-5 w-5" />, label: 'Sales Management', path: '/sales-management' },
  ];

  return (
    <aside className={`bg-white w-64 min-h-screen flex flex-col border-r border-gray-200 fixed transition-all duration-300 ease-in-out ${isOpen ? 'left-0' : '-left-64'} z-50`}>
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Henhouse studio</h2>
        <button onClick={toggleSidebar}>
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 py-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link to={item.path} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-turquoise rounded-md hover:bg-turquoise-dark">
          <Plus className="h-5 w-5 mr-2" />
          Create a workspace
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;