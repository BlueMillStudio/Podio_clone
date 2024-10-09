import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatBar from './ChatBar';
import HelpSidebar from './HelpSideBar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatBarOpen, setIsChatBarOpen] = useState(false);
  const [isHelpSidebarOpen, setIsHelpSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleChatBar = () => setIsChatBarOpen(!isChatBarOpen);
  const toggleHelpSidebar = () => setIsHelpSidebarOpen(!isHelpSidebarOpen);

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          toggleSidebar={toggleSidebar}
          toggleChatBar={toggleChatBar}
          toggleHelpSidebar={toggleHelpSidebar}
          handleLogout={handleLogout}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>
      <ChatBar isOpen={isChatBarOpen} toggleChatBar={toggleChatBar} />
      <HelpSidebar isOpen={isHelpSidebarOpen} toggleHelpSidebar={toggleHelpSidebar} />
    </div>
  );
};

export default Layout;