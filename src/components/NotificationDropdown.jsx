import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

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
        <div className="relative flex items-center" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="hover:text-gray-200 focus:outline-none flex items-center justify-center"
            >
                <Bell className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 text-gray-800">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="font-semibold">Notifications</h3>
                        <div>
                            <button className="text-teal-600 hover:text-teal-700 mr-2">All</button>
                            <button className="text-teal-600 hover:text-teal-700">Unread</button>
                        </div>
                    </div>
                    <div className="p-4 text-center text-gray-500">
                        <p>No new notifications.</p>
                    </div>
                    <div className="p-4 border-t flex justify-between items-center">
                        <button className="text-teal-600 hover:text-teal-700">Refresh</button>
                        <button className="text-teal-600 hover:text-teal-700">Settings</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;