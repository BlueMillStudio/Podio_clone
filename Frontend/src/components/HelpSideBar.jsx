import React from 'react';
import { X } from 'lucide-react';
import { Input } from "./ui/input";

const HelpSidebar = ({ isOpen, toggleHelpSidebar }) => {
  return (
    <aside className={`bg-white w-80 min-h-screen flex flex-col border-l border-gray-200 fixed top-0 right-0 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-lg font-semibold">Help & Support</h2>
        <button onClick={toggleHelpSidebar}>
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <Input
          type="text"
          placeholder="Type your question and hit Enter"
          className="mb-4"
        />
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Videos and Forums</h3>
            <ul className="space-y-1">
              <li className="text-blue-600">Watch intro video</li>
              <li className="text-blue-600">General help forum</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Popular topics</h3>
            <ul className="space-y-1">
              <li className="text-blue-600">The Structure of Podio</li>
              <li className="text-blue-600">Introduction: Podio Basics</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Tour</h3>
            <ul className="space-y-1">
              <li className="text-blue-600">Start tour</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What's new in Podio</h3>
            <ul className="space-y-1">
              <li className="text-blue-600">Product News</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Need more functionality?</h3>
            <ul className="space-y-1">
              <li className="text-blue-600">Browse extensions</li>
              <li className="text-blue-600">Keyboard shortcuts</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Can't find the answer?</h3>
            <ul className="space-y-1">
              <li className="text-blue-600">Help Centre and contact support</li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default HelpSidebar;
