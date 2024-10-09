import React from 'react';
import { format, isToday } from 'date-fns';

const DayView = ({ date }) => (
  <div className="flex flex-col h-screen">
    {/* Header */}
    <div className="flex">
      <div className="w-20 border-b border-r p-2"></div>
      <div
        className={`flex-grow text-center font-semibold border-b p-2 ${isToday(date) ? 'bg-yellow-50' : ''
          }`}
      >
        {format(date, 'EEEE d/M')}
      </div>
    </div>

    {/* Body */}
    <div className="flex-grow overflow-y-auto">
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} className="flex h-16 border-b">
          <div className="w-20 text-right text-sm border-r p-2">
            {format(new Date().setHours(i), 'HH:mm')}
          </div>
          <div
            className={`flex-grow ${isToday(date) ? 'bg-yellow-50' : ''
              }`}
          ></div>
        </div>
      ))}
    </div>
  </div>
);

export default DayView;
