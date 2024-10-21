import React from "react";
import {
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  isSameMonth,
  isToday,
  isSameDay,
} from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MonthView = ({ date, tasks }) => {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(date), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(date), { weekStartsOn: 1 }),
  });

  const getTasksForDate = (day) => {
    return tasks.filter((task) => isSameDay(new Date(task.due_date), day));
  };

  return (
    <div className="grid grid-cols-7">
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
        <div
          key={day}
          className="text-center font-semibold border-b border-r p-2"
        >
          {day}
        </div>
      ))}

      {days.map((day, idx) => (
        <div
          key={idx}
          className={`border-b border-r h-24 ${
            !isSameMonth(day, date) ? "text-gray-400 bg-gray-100" : ""
          } ${isToday(day) ? "bg-yellow-50" : ""}`}
        >
          <div className="p-2">
            <div className="font-semibold">{format(day, "d")}</div>
            <ScrollArea className="h-16 mt-1">
              {getTasksForDate(day).map((task) => (
                <TooltipProvider key={task.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="mb-1">
                        <Badge
                          variant="outline"
                          className="text-xs truncate w-full"
                        >
                          {task.title}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div>
                        <p className="font-semibold">{task.title}</p>
                        <p className="text-sm">{task.description}</p>
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
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </ScrollArea>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonthView;
