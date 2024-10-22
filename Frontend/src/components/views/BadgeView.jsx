import React from 'react';

const BadgeView = ({ appFields, appItems }) => {
    // Function to determine badge color based on some logic or field value
    const getBadgeColor = (value) => {
        if (!value) return 'bg-gray-300';
        const firstChar = value.charAt(0).toLowerCase();
        if (['a', 'b', 'c'].includes(firstChar)) return 'bg-red-500';
        if (['d', 'e', 'f'].includes(firstChar)) return 'bg-green-500';
        if (['g', 'h', 'i'].includes(firstChar)) return 'bg-blue-500';
        return 'bg-purple-500';
    };

    return (
        <div className="flex flex-wrap gap-3">
            {appItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                    <span
                        className={`text-white px-4 py-2 rounded-full text-sm ${getBadgeColor(
                            item.data[appFields[0].name]
                        )}`}
                    >
                        {item.data[appFields[0].name] || 'Item'}
                    </span>
                    {/* Optionally, add tooltip or additional info */}
                </div>
            ))}
        </div>
    );
};

export default BadgeView;
