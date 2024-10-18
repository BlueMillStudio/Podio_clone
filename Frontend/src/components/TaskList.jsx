import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { toast } from "sonner";

const TaskList = ({ tasks, onTaskUpdate }) => {
  const handleTaskCompletion = async (taskId, completed) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          status: completed ? "completed" : "pending",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onTaskUpdate(response.data);
      toast.success(`Task ${completed ? "completed" : "reopened"}`);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error updating task. Please try again.");
    }
  };

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center p-2 border-b">
          <Checkbox
            checked={task.status === "completed"}
            onCheckedChange={(checked) => {
              handleTaskCompletion(task.id, checked);
            }}
            className="mr-2"
          />
          <span
            className={`flex-grow ${task.status === "completed" ? "line-through" : ""
              }`}
          >
            {task.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
