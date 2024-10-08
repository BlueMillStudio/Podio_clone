// ProfileDropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Settings,
  CreditCard,
  Briefcase,
  Share2,
  LogOut,
} from "lucide-react";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="hover:text-gray-200 focus:outline-none p-1"
      >
        <User className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-20 text-gray-800">
          <div className="p-4 border-b">
            <p className="font-semibold">dilsha thathsarani</p>
            <p className="text-sm text-gray-600">Complete your profile</p>
          </div>
          <ul className="py-2">
            <MenuItem
              icon={<User className="h-4 w-4" />}
              text="Complete your profile"
            />
            <MenuItem
              icon={<Settings className="h-4 w-4" />}
              text="Account settings"
            />
            <MenuItem
              icon={<CreditCard className="h-4 w-4" />}
              text="Extension Voucher offer"
            />
            <MenuItem
              icon={<Briefcase className="h-4 w-4" />}
              text="Create another organization"
            />
            <MenuItem
              icon={<CreditCard className="h-4 w-4" />}
              text="Pricing"
            />
            <MenuItem
              icon={<CreditCard className="h-4 w-4" />}
              text="Billing"
            />
            <MenuItem
              icon={<Settings className="h-4 w-4" />}
              text="Batch jobs"
            />
            <MenuItem
              icon={<Share2 className="h-4 w-4" />}
              text="My shared apps"
            />
            <MenuItem icon={<LogOut className="h-4 w-4" />} text="Sign out" />
          </ul>
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ icon, text }) => (
  <li>
    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
      {icon}
      <span>{text}</span>
    </button>
  </li>
);

export default ProfileDropdown;
