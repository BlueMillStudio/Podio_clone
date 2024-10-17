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
import { useNavigate } from "react-router-dom";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "https://pp-tynr.onrender.com/api/profile/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserName(data.user.username);
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
            <p className="font-semibold">{userName}</p>
            {/* Optionally, add more user info */}
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
            <MenuItem
              icon={<LogOut className="h-4 w-4" />}
              text="Sign out"
              onClick={handleLogout}
            />
          </ul>
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ icon, text, onClick }) => (
  <li>
    <button
      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
    </button>
  </li>
);

export default ProfileDropdown;
