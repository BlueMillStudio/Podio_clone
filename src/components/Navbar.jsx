import React from 'react';
import { Bell, HelpCircle, Search, User, Menu, MessageSquare } from 'lucide-react';
import { Input } from './ui/input';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-turquoise text-white px-4 py-2.5 flex items-center justify-between">
      <div className="flex items-center flex-1">
        <button onClick={toggleSidebar} className="mr-4">
          <Menu className="h-6 w-6" />
        </button>
        <img src="/placeholder.svg" alt="Podio" className="h-8 w-auto mr-4" />
        <Input 
          type="search" 
          placeholder="Search..." 
          className="max-w-sm bg-turquoise-light text-gray-800 placeholder-gray-500"
          startAdornment={<Search className="h-4 w-4 text-gray-500" />}
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="hover:text-gray-200">
          <HelpCircle className="h-6 w-6" />
        </button>
        <button className="hover:text-gray-200">
          <Bell className="h-6 w-6" />
        </button>
        <button className="hover:text-gray-200">
          <MessageSquare className="h-6 w-6" />
        </button>
        <button className="hover:text-gray-200">
          <User className="h-6 w-6" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;