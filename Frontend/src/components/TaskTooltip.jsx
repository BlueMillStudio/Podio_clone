import React from "react";
import { Badge } from "@/components/ui/badge";

const TaskTooltip = ({ task }) => {
  return (
    <div className="p-2 max-w-xs">
      <h3 className="font-semibold text-sm mb-1">{task.title}</h3>
      {task.description && (
        <p className="text-xs text-gray-600 mb-2">{task.description}</p>
      )}
      <div className="space-y-1">
        <div className="text-xs">
          <span className="text-gray-500">Created by: </span>
          <span>{task.creator_name || task.creator_email}</span>
        </div>
        {task.due_date && (
          <div className="text-xs">
            <span className="text-gray-500">Due: </span>
            <span>{new Date(task.due_date).toLocaleDateString()}</span>
          </div>
        )}
        {task.assignees && task.assignees.length > 0 && (
          <div className="mt-2">
            <span className="text-xs text-gray-500">Assignees:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {task.assignees.map((assignee, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {assignee.name || assignee.email}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {task.labels && task.labels.length > 0 && (
          <div className="mt-2">
            <span className="text-xs text-gray-500">Labels:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {task.labels.map((label, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTooltip;
