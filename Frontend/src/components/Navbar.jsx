import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HelpCircle,
  Search,
  Menu,
  MessageSquare,
  Users,
  Calendar,
  CheckSquare,
  LogOut
} from "lucide-react";
import { Input } from "./ui/input";
import ProfileDropdown from "./ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";


const Navbar = ({ toggleSidebar, toggleChatBar, toggleHelpSidebar, handleLogout }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleSearch = () => {
    setIsSearchExpanded((prev) => !prev);
  };

  const handleCalendarClick = () => {
    navigate("/calendar");
  };

  const handleConnectionsClick = () => {
    navigate("/connections");
  };

  const handleTaskClick = () => {
    navigate("/task");
  };

  return (
    <TooltipProvider>
      <nav className="bg-teal-400 text-white px-4 py-3 flex items-center justify-between relative h-16">
        {/* Left Section */}
        <div className="flex items-center space-x-2">
          <NavbarIcon
            icon={<Menu className="h-5 w-5" />}
            tooltip="Toggle Sidebar"
            onClick={toggleSidebar}
          />
          <NavbarIcon
            icon={<Users className="h-5 w-5" />}
            tooltip="Connections"
            onClick={handleConnectionsClick}
          />
          <NavbarIcon
            icon={<Calendar className="h-5 w-5" />}
            tooltip="Calendar"
            onClick={handleCalendarClick}
          />
          <NavbarIcon
            icon={<CheckSquare className="h-5 w-5" />}
            tooltip="Tasks"
            onClick={handleTaskClick}
          />
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center">
            <img
              src="/images/logo.jpg"
              alt="Company Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
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

          <NavbarIcon
            icon={<HelpCircle className="h-5 w-5" />}
            tooltip="Help"
            onClick={toggleHelpSidebar}
          />

          <NavbarIcon
            icon={<MessageSquare className="h-5 w-5" />}
            tooltip="Chat"
            onClick={toggleChatBar}
          />
          <ProfileDropdown />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleLogout} variant="ghost" className="text-white hover:text-gray-200 p-1">
                <LogOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </nav>
    </TooltipProvider>
  );
};

const NavbarIcon = ({ icon, tooltip, onClick }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        className="hover:text-gray-200 p-1 flex items-center justify-center"
        onClick={onClick}
      >
        {icon}
      </button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

export default Navbar;
