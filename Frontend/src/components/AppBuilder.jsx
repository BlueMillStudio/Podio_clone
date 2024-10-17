import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AppBuilder = () => {
  const { workspaceId } = useParams();
  const [appName, setAppName] = useState("");
  const [fields, setFields] = useState([]);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [isRequired, setIsRequired] = useState(false);
  const navigate = useNavigate();

  const addField = () => {
    if (fieldName.trim() === "") return;

    setFields([
      ...fields,
      { name: fieldName, field_type: fieldType, is_required: isRequired },
    ]);
    setFieldName("");
    setFieldType("text");
    setIsRequired(false);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("https://pp-tynr.onrender.com/api/apps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workspaceId,
          name: appName,
          fields,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect or update UI as needed
        navigate(`/workspaces/${workspaceId}/apps`);
      } else {
        const errorData = await response.json();
        console.error("Error creating app:", errorData.message);
        // Handle error (e.g., display error message)
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., display error message)
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Create New App</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            App Name
          </label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-4">Fields</h3>
        {fields.map((field, index) => (
          <div key={index} className="flex items-center mb-2">
            <span className="flex-1">
              {field.name} ({field.field_type}) {field.is_required && "*"}
            </span>
            <button
              type="button"
              onClick={() => removeField(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="flex items-end mb-6">
          <div className="flex-1 mr-2">
            <label className="block text-sm font-medium text-gray-700">
              Field Name
            </label>
            <input
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div className="mr-2">
            <label className="block text-sm font-medium text-gray-700">
              Field Type
            </label>
            <select
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
          </div>
          <div className="mr-2">
            <label className="block text-sm font-medium text-gray-700">
              Required
            </label>
            <input
              type="checkbox"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="mt-2"
            />
          </div>
          <button
            type="button"
            onClick={addField}
            className="px-4 py-2 bg-teal-600 text-white rounded"
          >
            Add Field
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded"
          >
            Create App
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppBuilder;

