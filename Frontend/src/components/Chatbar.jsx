import React from 'react';
import { X } from 'lucide-react';

const ChatBar = ({ isOpen, toggleChatBar }) => {
    return (
        <aside className={`bg-white w-80 min-h-screen flex flex-col border-l border-gray-200 fixed top-0 right-0 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
                <h2 className="text-lg font-semibold">Chat</h2>
                <button onClick={toggleChatBar}>
                    <X className="h-6 w-6" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {/* Chat messages will go here */}
                <p className="text-gray-500">No messages yet.</p>
            </div>
            <div className="p-4 border-t border-gray-200">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent"
                />
            </div>
        </aside>
    );
};

export default ChatBar;