import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const ActivityView = ({ appFields, appItems, handleFormOpen, handleDeleteItem }) => (
    <div className="space-y-4">
        {appItems.map((item) => (
            <div key={item.id} className="flex items-start bg-white p-4 border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition">
                <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-teal-600 text-white flex items-center justify-center rounded-full">
                        {item.data[appFields[0].name]?.charAt(0).toUpperCase() || 'I'}
                    </div>
                </div>
                <div className="ml-4 w-full">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">{item.data[appFields[0].name] || 'Item'}</h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleFormOpen('edit', item)}
                                className="text-teal-600 hover:text-teal-800 transition"
                            >
                                <Edit className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-red-600 hover:text-red-800 transition"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="mt-2">
                        {appFields.slice(1).map((field) => (
                            <p key={field.id} className="text-sm text-gray-700">
                                <span className="font-semibold">{field.name}:</span> {item.data[field.name] || '-'}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default ActivityView;
