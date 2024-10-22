import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const TableView = ({ appFields, appItems, handleFormOpen, handleDeleteItem }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
                <tr>
                    {appFields.map((field) => (
                        <th
                            key={field.id}
                            className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                        >
                            {field.name}
                        </th>
                    ))}
                    <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                </tr>
            </thead>
            <tbody>
                {appItems.map((item, index) => (
                    <tr
                        key={item.id}
                        className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}
                    >
                        {appFields.map((field) => (
                            <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {item.data[field.name] || '-'}
                            </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default TableView;
