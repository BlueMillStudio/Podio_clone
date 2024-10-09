import React from 'react';
import { eachDayOfInterval, startOfWeek, endOfWeek, format, isToday } from 'date-fns';

const WeekView = ({ date }) => {
  // Generate an array of days for the current week
  const daysOfWeek = eachDayOfInterval({
    start: startOfWeek(date),
    end: endOfWeek(date),
  });

  return (
    <div className="grid grid-cols-[auto,repeat(7,minmax(0,1fr))]">
      {/* Header Row */}
      <div className="text-right text-sm font-semibold border-b border-r p-2">Time</div>
      {daysOfWeek.map((day, idx) => (
        <div
          key={idx}
          className={`text-center font-semibold border-b border-r p-2 ${isToday(day) ? 'bg-yellow-50' : ''
            }`}
        >
          {format(day, 'EEE d/M')}
        </div>
      ))}

      {/* Body Rows */}
      {Array.from({ length: 24 }, (_, i) => (
        <React.Fragment key={i}>
          <div className="text-right text-sm border-b border-r p-2">
            {format(new Date().setHours(i), 'HH:mm')}
          </div>
          {daysOfWeek.map((day, idx) => (
            <div
              key={idx}
              className={`h-12 border-b border-r ${isToday(day) ? 'bg-yellow-50' : ''
                }`}
            ></div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default WeekView;
