import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatBar from './ChatBar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatBarOpen, setIsChatBarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleChatBar = () => {
    setIsChatBarOpen(!isChatBarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} toggleChatBar={toggleChatBar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          {children}
        </main>
      </div>
      <ChatBar isOpen={isChatBarOpen} toggleChatBar={toggleChatBar} />
    </div>
  );
};

export default Layout;