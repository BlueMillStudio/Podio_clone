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
import TaskTooltip from "./TaskTooltip";

const MonthView = ({ date, tasks }) => {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(date), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(date), { weekStartsOn: 1 }),
  });

  const getTasksForDate = (day) => {
    return tasks.filter(
      (task) => task.due_date && isSameDay(new Date(task.due_date), day)
    );
  };

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  return (
    <div className="grid grid-cols-7 border-l border-t">
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
          className={`border-b border-r min-h-[120px] ${
            !isSameMonth(day, date) ? "text-gray-400 bg-gray-50" : ""
          } ${isToday(day) ? "bg-blue-50" : ""}`}
        >
          <div className="p-2">
            <div className="font-semibold">{format(day, "d")}</div>
            <ScrollArea className="h-20 mt-1">
              {getTasksForDate(day).map((task) => (
                <TooltipProvider key={task.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="mb-1">
                        <Badge
                          variant="outline"
                          className={`text-xs truncate w-full ${
                            task.creator_id === userId
                              ? "bg-blue-50"
                              : "bg-green-50"
                          }`}
                        >
                          {task.title}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <TaskTooltip task={task} />
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
