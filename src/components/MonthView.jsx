import React from 'react';
import {
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  isSameMonth,
  isToday,
} from 'date-fns';

const MonthView = ({ date }) => {
  // Generate all days to display in the month view
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(date), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(date), { weekStartsOn: 1 }),
  });

  return (
    <div className="grid grid-cols-7">
      {/* Weekday Headers */}
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
        <div key={day} className="text-center font-semibold border-b border-r p-2">
          {day}
        </div>
      ))}

      {/* Days */}
      {days.map((day, idx) => (
        <div
          key={idx}
          className={`border-b border-r h-24 ${!isSameMonth(day, date) ? 'text-gray-400 bg-gray-100' : ''
            } ${isToday(day) ? 'bg-yellow-50' : ''}`}
        >
          <div className="p-2">
            <div className="font-semibold">{format(day, 'd')}</div>
            {/* Add event indicators or other content here */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonthView;
