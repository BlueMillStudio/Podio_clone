import React, { useState } from "react";
import {
  Bell,
  HelpCircle,
  Search,
  User,
  Menu,
  MessageSquare,
  X,
} from "lucide-react";
import { Input } from "./ui/input";
import HelpSidebar from "./HelpSidebar";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = ({ toggleSidebar }) => {
  const [isHelpSidebarOpen, setIsHelpSidebarOpen] = useState(false);

  const openHelpSidebar = () => setIsHelpSidebarOpen(true);
  const closeHelpSidebar = () => setIsHelpSidebarOpen(false);

  return (
    <>
      <nav className="bg-teal-400 text-white px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center flex-1">
          <button onClick={toggleSidebar} className="mr-4">
            <Menu className="h-6 w-6" />
          </button>
          <img src="/placeholder.svg" alt="Podio" className="h-8 w-auto mr-4" />
          <Input
            type="search"
            placeholder="Search..."
            className="max-w-sm bg-teal-300 text-gray-800 placeholder-gray-600 border-none"
            startAdornment={<Search className="h-4 w-4 text-gray-600" />}
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="hover:text-gray-200" onClick={openHelpSidebar}>
            <HelpCircle className="h-6 w-6" />
          </button>
          <button className="hover:text-gray-200">
            <Bell className="h-6 w-6" />
          </button>
          <button className="hover:text-gray-200">
            <MessageSquare className="h-6 w-6" />
          </button>
          <ProfileDropdown />
        </div>
      </nav>
      <HelpSidebar isOpen={isHelpSidebarOpen} onClose={closeHelpSidebar} />
    </>
  );
};

export default Navbar;
