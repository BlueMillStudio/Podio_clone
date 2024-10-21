import React from "react";
import { format, isToday, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const DayView = ({ date, tasks }) => {
  const getTasksForDate = (day) => {
    return tasks.filter((task) => isSameDay(new Date(task.due_date), day));
  };

  const dayTasks = getTasksForDate(date);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex">
        <div className="w-20 border-b border-r p-2"></div>
        <div
          className={`flex-grow text-center font-semibold border-b p-2 ${
            isToday(date) ? "bg-yellow-50" : ""
          }`}
        >
          {format(date, "EEEE d/M")}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className="flex h-16 border-b">
            <div className="w-20 text-right text-sm border-r p-2">
              {format(new Date().setHours(i), "HH:mm")}
            </div>
            <div className={`flex-grow ${isToday(date) ? "bg-yellow-50" : ""}`}>
              <ScrollArea className="h-full">
                {dayTasks.map((task) => (
                  <div key={task.id} className="mb-1 p-1">
                    <Badge
                      variant="outline"
                      className="text-xs truncate w-full"
                    >
                      {task.title}
                    </Badge>
                    <p className="text-xs text-gray-600 mt-1">
                      {task.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {task.labels &&
                        task.labels.map((label, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {label}
                          </Badge>
                        ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayView;
