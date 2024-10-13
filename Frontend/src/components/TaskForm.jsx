import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Paperclip, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { TimePicker } from "@/components/TimePicker";
import axios from "axios";
import LabelInput from "./LabelInput";
import { toast } from "sonner";

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [labels, setLabels] = useState([]);
  const fileInputRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users. Please try again.");
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleAssigneeChange = (value) => {
    setAssignee(value);
    if (value) {
      const filtered = users.filter((user) =>
        user.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };

  const handleUserSelect = (email) => {
    setAssignee(email);
    setFilteredUsers([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Find the user ID based on the selected email
      const selectedUser = users.find((user) => user.email === assignee);
      if (!selectedUser) {
        toast.error("Selected user not found. Please choose a valid user.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title,
          description,
          due_date: date ? format(date, "yyyy-MM-dd") : null,
          due_time: time || null,
          status: "pending",
          assignee_id: selectedUser.id,
          attachment_url: null,
          attachment_name: attachedFile ? attachedFile.name : null,
          labels,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Task created:", response.data);
      toast.success("Task created successfully");
      onTaskCreated(response.data);
      resetForm();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Error creating task. Please try again.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAssignee("");
    setDate(null);
    setTime("");
    setAttachedFile(null);
    setLabels([]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-yellow-50 p-4 mb-4 rounded-md">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm">
          You can assign tasks to yourself, to co-workers on Podio and to anyone
          else via email
        </p>
        <Button variant="ghost" size="sm" type="button">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Input
        className="mb-2"
        placeholder="Enter a task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <div className="flex mb-2 relative">
        <Input
          className="flex-grow mr-2"
          placeholder="Pick a connection or type an email address"
          value={assignee}
          onChange={(e) => handleAssigneeChange(e.target.value)}
        />
        {filteredUsers.length > 0 && (
          <div className="absolute z-10 w-full bg-white mt-10 border rounded-md shadow-lg">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleUserSelect(user.email)}
              >
                {user.email}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex space-x-2 mb-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-[180px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>No due date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <TimePicker value={time} onChange={setTime} />
      </div>
      <Input
        className="mb-2"
        placeholder="Enter more information about your task..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <LabelInput labels={labels} setLabels={setLabels} />
      <div className="flex justify-between items-center">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button type="button" variant="outline" onClick={handleFileAttach}>
            <Paperclip className="h-4 w-4 mr-2" />
            {attachedFile ? attachedFile.name : "Attach file"}
          </Button>
        </div>
        <Button type="submit">Create task</Button>
      </div>
    </form>
  );
};

export default TaskForm;
