import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const CardView = ({ appFields, appItems, handleFormOpen, handleDeleteItem }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {appItems.map((item) => (
            <div key={item.id} className="bg-white p-6 border border-gray-200 rounded-lg shadow hover:shadow-lg transition">
                <div className="flex justify-end">
                    <button
                        onClick={() => handleFormOpen('edit', item)}
                        className="text-teal-600 hover:text-teal-800 transition mr-2"
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
                <div className="mt-4">
                    {appFields.map((field) => (
                        <p key={field.id} className="text-sm text-gray-700 mb-2">
                            <span className="font-semibold">{field.name}:</span> {item.data[field.name] || '-'}
                        </p>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

export default CardView;
