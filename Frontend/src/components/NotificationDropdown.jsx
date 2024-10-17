// NotificationDropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

const NotificationDropdown = () => {
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
                <Bell className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-20 text-gray-800">
                    <div className="p-4 border-b">
                        <h3 className="font-semibold">Notifications</h3>
                        <p className="text-sm text-gray-600">You have 3 new notifications</p>
                    </div>
                    <ul className="py-2">
                        <MenuItem
                            text="Notification 1"
                        />
                        <MenuItem
                            text="Notification 2"
                        />
                        <MenuItem
                            text="Notification 3"
                        />
                    </ul>
                    <div className="p-4 border-t flex justify-between items-center">
                        <button className="text-teal-600 hover:text-teal-700">Mark all as read</button>
                        <button className="text-teal-600 hover:text-teal-700">Settings</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const MenuItem = ({ text }) => (
    <li>
        <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
            {text}
        </button>
    </li>
);

export default NotificationDropdown;
