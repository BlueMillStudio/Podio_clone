import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const LabelInput = ({ labels, setLabels }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      setLabels([...labels, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeLabel = (labelToRemove) => {
    setLabels(labels.filter((label) => label !== labelToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {labels.map((label, index) => (
          <span
            key={index}
            className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
          >
            {label}
            <button
              onClick={() => removeLabel(label)}
              className="ml-1 focus:outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <Input
        className="mb-2"
        placeholder="Add labels..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
      />
    </div>
  );
};

export default LabelInput;
