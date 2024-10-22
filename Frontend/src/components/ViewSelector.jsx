import React from 'react';

const ViewSelector = ({ view, setView }) => (
    <div className="flex justify-end items-center mb-6">
        <label htmlFor="viewSelect" className="mr-2 text-sm font-medium text-gray-700">
            View:
        </label>
        <select
            id="viewSelect"
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
            <option value="table">Table</option>
            <option value="card">Card</option>
            <option value="activity">Activity</option>
            <option value="badge">Badge</option>
        </select>
    </div>
);

export default ViewSelector;
