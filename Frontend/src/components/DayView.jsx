import React from "react";
import { format, isToday, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DayView = ({ date, tasks }) => {
  const getTasksForDate = (day) => {
    return tasks.filter(
      (task) => task.due_date && isSameDay(new Date(task.due_date), day)
    );
  };

  const getTasksForHour = (hour, allTasks) => {
    return allTasks.filter((task) => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return taskDate.getHours() === hour;
    });
  };

  const dayTasks = getTasksForDate(date);
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  return (
    <div className="flex flex-col border-l border-t h-full">
      <div className="grid grid-cols-[100px,1fr] bg-white sticky top-0">
        <div className="border-b border-r p-2 bg-white" />
        <div
          className={`text-center font-semibold border-b border-r p-2 ${
            isToday(date) ? "bg-blue-50" : ""
          }`}
        >
          {format(date, "EEEE, MMMM d")}
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        {Array.from({ length: 24 }, (_, i) => {
          const hourTasks = getTasksForHour(i, dayTasks);

          return (
            <div key={i} className="grid grid-cols-[100px,1fr] min-h-[100px]">
              <div className="text-right text-sm border-b border-r p-2 bg-white sticky left-0">
                {format(new Date().setHours(i), "HH:mm")}
              </div>
              <div
                className={`border-b border-r relative ${
                  isToday(date) ? "bg-blue-50" : ""
                }`}
              >
                <ScrollArea className="h-full p-1">
                  {hourTasks.map((task) => (
                    <TooltipProvider key={task.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="mb-1">
                            <Badge
                              variant="outline"
                              className={`text-xs p-2 truncate w-full cursor-pointer hover:bg-opacity-90 ${
                                task.creator_id === userId
                                  ? "bg-blue-100 border-blue-200"
                                  : "bg-green-100 border-green-200"
                              }`}
                            >
                              {task.title}
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="p-2 max-w-xs">
                            <h3 className="font-semibold text-sm mb-1">
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-xs text-gray-600 mb-2">
                                {task.description}
                              </p>
                            )}
                            <div className="space-y-1">
                              <div className="text-xs">
                                <span className="text-gray-500">
                                  Created by:{" "}
                                </span>
                                <span>
                                  {task.creator_name || task.creator_email}
                                </span>
                              </div>
                              <div className="text-xs">
                                <span className="text-gray-500">Due: </span>
                                <span>
                                  {format(new Date(task.due_date), "PPp")}
                                </span>
                              </div>
                              {task.assignees && task.assignees.length > 0 && (
                                <div>
                                  <span className="text-xs text-gray-500">
                                    Assignees:
                                  </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {task.assignees.map((assignee, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {assignee.name || assignee.email}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {task.labels && task.labels.length > 0 && (
                                <div>
                                  <span className="text-xs text-gray-500">
                                    Labels:
                                  </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {task.labels.map((label, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {label}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </ScrollArea>

                {/* Current time indicator if today */}
                {isToday(date) && new Date().getHours() === i && (
                  <div
                    className="absolute left-0 right-0 border-t-2 border-red-400"
                    style={{
                      top: `${(new Date().getMinutes() / 60) * 100}%`,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* All-day tasks or tasks without specific time */}
      {dayTasks.filter(
        (task) => !task.due_date || new Date(task.due_date).getHours() === 0
      ).length > 0 && (
        <div className="border-b p-2">
          <h3 className="font-semibold mb-2">All-day</h3>
          <div className="space-y-1">
            {dayTasks
              .filter(
                (task) =>
                  !task.due_date || new Date(task.due_date).getHours() === 0
              )
              .map((task) => (
                <TooltipProvider key={task.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className={`text-xs p-2 truncate w-full cursor-pointer hover:bg-opacity-90 ${
                          task.creator_id === userId
                            ? "bg-blue-100 border-blue-200"
                            : "bg-green-100 border-green-200"
                        }`}
                      >
                        {task.title}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="p-2 max-w-xs">
                        <h3 className="font-semibold text-sm mb-1">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-xs text-gray-600 mb-2">
                            {task.description}
                          </p>
                        )}
                        <div className="text-xs">
                          <span className="text-gray-500">Created by: </span>
                          <span>{task.creator_name || task.creator_email}</span>
                        </div>
                        {task.assignees && task.assignees.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-500">
                              Assignees:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {task.assignees.map((assignee, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {assignee.name || assignee.email}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DayView;
