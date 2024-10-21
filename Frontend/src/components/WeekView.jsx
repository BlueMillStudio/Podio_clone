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

const WeekView = ({ date, tasks }) => {
  const daysOfWeek = eachDayOfInterval({
    start: startOfWeek(date),
    end: endOfWeek(date),
  });

  const getTasksForDate = (day) => {
    return tasks.filter((task) => isSameDay(new Date(task.due_date), day));
  };

  return (
    <div className="grid grid-cols-[auto,repeat(7,minmax(0,1fr))]">
      <div className="text-right text-sm font-semibold border-b border-r p-2">
        Time
      </div>
      {daysOfWeek.map((day, idx) => (
        <div
          key={idx}
          className={`text-center font-semibold border-b border-r p-2 ${
            isToday(day) ? "bg-yellow-50" : ""
          }`}
        >
          {format(day, "EEE d/M")}
        </div>
      ))}

      {Array.from({ length: 24 }, (_, i) => (
        <React.Fragment key={i}>
          <div className="text-right text-sm border-b border-r p-2">
            {format(new Date().setHours(i), "HH:mm")}
          </div>
          {daysOfWeek.map((day, idx) => (
            <div
              key={idx}
              className={`h-12 border-b border-r ${
                isToday(day) ? "bg-yellow-50" : ""
              }`}
            >
              <ScrollArea className="h-full">
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
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default WeekView;
