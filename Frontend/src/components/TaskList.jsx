import React from "react";
import { Button } from "@/components/ui/button";

const TaskList = ({ tasks }) => (
  <div>
    {tasks.map((task) => (
      <div key={task.id} className="flex items-center p-2 border-b">
        <input type="checkbox" className="mr-2" checked={task.completed} />
        <span className="flex-grow">{task.title}</span>
        <Button variant="ghost">Actions</Button>
      </div>
    ))}
  </div>
);

export default TaskList;
