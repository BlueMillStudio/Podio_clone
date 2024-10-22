import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [assignees, setAssignees] = useState([]);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAssignees();
    }
  }, [isOpen]);

  const fetchAssignees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/invitations",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Filter only accepted invitations
      const acceptedInvitations = response.data.filter(
        (inv) => inv.status === "accepted"
      );
      setAssignees(acceptedInvitations);
    } catch (error) {
      console.error("Error fetching assignees:", error);
      toast.error("Failed to fetch team members");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) {
      toast.error("Please enter a task");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title: task,
          description,
          due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
          assignee_ids: selectedAssignees,
          workspace_id: "employee-network", // or however you identify the employee network
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Task created successfully");
      onTaskCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New task on Employee Network</DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Enter a task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "No due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {dueDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDueDate(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div>
              <Input
                placeholder="Pick a connection or type an email address"
                type="email"
                onChange={(e) => {
                  // Handle assignee selection
                }}
              />
              <div className="mt-2">
                {assignees.map((assignee) => (
                  <div
                    key={assignee.id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                    onClick={() => {
                      if (!selectedAssignees.includes(assignee.id)) {
                        setSelectedAssignees([
                          ...selectedAssignees,
                          assignee.id,
                        ]);
                      }
                    }}
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {assignee.recipient_email[0].toUpperCase()}
                    </div>
                    <span>{assignee.recipient_email}</span>
                  </div>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Enter more information about your task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
