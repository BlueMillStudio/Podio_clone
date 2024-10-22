import React from "react";
import {
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
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

const WeekView = ({ date, tasks }) => {
  const daysOfWeek = eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  });

  const getTasksForDate = (day) => {
    return tasks.filter(
      (task) => task.due_date && isSameDay(new Date(task.due_date), day)
    );
  };

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  return (
    <div className="grid grid-cols-[auto,repeat(7,minmax(0,1fr))] border-l border-t">
      <div className="border-b border-r p-2" />
      {daysOfWeek.map((day, idx) => (
        <div
          key={idx}
          className={`text-center font-semibold border-b border-r p-2 ${
            isToday(day) ? "bg-blue-50" : ""
          }`}
        >
          {format(day, "EEE d/M")}
        </div>
      ))}

      {Array.from({ length: 24 }, (_, i) => (
        <React.Fragment key={i}>
          <div className="text-right text-sm border-b border-r p-2 sticky left-0 bg-white">
            {format(new Date().setHours(i), "HH:mm")}
          </div>
          {daysOfWeek.map((day, idx) => (
            <div
              key={idx}
              className={`border-b border-r min-h-[60px] ${
                isToday(day) ? "bg-blue-50" : ""
              }`}
            >
              <ScrollArea className="h-full">
                {getTasksForDate(day).map((task) => (
                  <TooltipProvider key={task.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="m-1">
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
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default WeekView;
