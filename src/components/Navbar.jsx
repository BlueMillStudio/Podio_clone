// Navbar.jsx
import React, { useState } from "react";
import {
  HelpCircle,
  Search,
  Menu,
  MessageSquare,
  Users,
  Calendar,
  CheckSquare,
} from "lucide-react";
import { Input } from "./ui/input";
import ProfileDropdown from "./ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const Navbar = ({ toggleSidebar, toggleChatBar, toggleHelpSidebar }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const toggleSearch = () => {
    setIsSearchExpanded((prev) => !prev);
  };

  return (
    <TooltipProvider>
      <nav className="bg-teal-400 text-white px-4 py-3 flex items-center justify-between relative h-16">
        {/* Left Section */}
        <div className="flex items-center space-x-2">
          <NavbarIcon icon={<Menu className="h-5 w-5" />} tooltip="Toggle Sidebar" onClick={toggleSidebar} />
          <NavbarIcon icon={<Users className="h-5 w-5" />} tooltip="Connections" />
          <NavbarIcon icon={<Calendar className="h-5 w-5" />} tooltip="Calendar" />
          <NavbarIcon icon={<CheckSquare className="h-5 w-5" />} tooltip="Tasks" />
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img src="/placeholder.svg" alt="Podio" className="h-8 w-auto" />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {isSearchExpanded && (
            <Input
              type="search"
              placeholder="Search..."
              className="w-48 bg-teal-300 text-gray-800 placeholder-gray-600 border-none h-9"
            />
          )}
          <NavbarIcon icon={<Search className="h-5 w-5" />} tooltip="Search" onClick={toggleSearch} />
          <NavbarIcon icon={<HelpCircle className="h-5 w-5" />} tooltip="Help" onClick={toggleHelpSidebar} />

          {/* Notification Dropdown placed directly */}
          <NotificationDropdown />

          <NavbarIcon icon={<MessageSquare className="h-5 w-5" />} tooltip="Chat" onClick={toggleChatBar} />
          <ProfileDropdown />
        </div>
      </nav>
    </TooltipProvider>
  );
};

const NavbarIcon = ({ icon, tooltip, onClick }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button className="hover:text-gray-200 p-1 flex items-center justify-center" onClick={onClick}>
        {icon}
      </button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

export default Navbar;
