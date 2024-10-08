import { X } from "lucide-react";
import { Input } from "./ui/input";

const HelpSidebar = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg z-50 overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Help & Support</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
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
    </div>
  );
};

export default HelpSidebar;
