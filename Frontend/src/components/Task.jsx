import React, { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Paperclip,
  Tag,
  X,
  Mail,
  Printer,
  ChevronDown,
  Plus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { TimePicker } from "@/components/TimePicker";

const TaskForm = () => {
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileAttach = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  return (
    <div className="bg-yellow-50 p-4 mb-4 rounded-md">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm">
          You can assign tasks to yourself, to co-workers on Podio and to anyone
          else via email
        </p>
        <Button variant="ghost" size="sm">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Input className="mb-2" placeholder="Enter a task..." />
      <div className="flex mb-2">
        <Input
          className="flex-grow mr-2"
          placeholder="Pick a connection or type an email address"
        />
        <Button variant="outline">Address book</Button>
      </div>
      <div className="flex space-x-2 mb-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
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
            <Select
              onValueChange={(value) =>
                setDate(value === "custom" ? null : new Date(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="nextMonday">Next Monday</SelectItem>
                <SelectItem value="custom">Custom date</SelectItem>
              </SelectContent>
            </Select>
            {date === null && (
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            )}
          </PopoverContent>
        </Popover>
        <TimePicker value={time} onChange={setTime} />
        <Input
          className="flex-grow"
          placeholder="Attach this task to any item or workspace..."
        />
      </div>
      <Input
        className="mb-2"
        placeholder="Enter more information about your task..."
      />
      <Input className="mb-2" placeholder="Add labels..." />
      <div className="flex justify-between items-center">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button variant="outline" onClick={handleFileAttach}>
            <Paperclip className="h-4 w-4 mr-2" />
            {attachedFile ? attachedFile.name : "Attach file"}
          </Button>
        </div>
        <Button>Create task</Button>
      </div>
    </div>
  );
};

const TaskList = ({ tasks }) => (
  <div>
    {tasks.map((task, index) => (
      <div key={index} className="flex items-center p-2 border-b">
        <input type="checkbox" className="mr-2" />
        <span className="flex-grow">{task.title}</span>
        <Button variant="ghost">Actions</Button>
      </div>
    ))}
  </div>
);

const LabelSection = () => (
  <div className="bg-white p-4 rounded-md">
    <h2 className="text-xl font-semibold mb-4">Labels</h2>
    <Button variant="outline" className="w-full mb-4">
      <Plus className="h-4 w-4 mr-2" />
      NEW LABEL
    </Button>
    {/* <div className="space-y-2">
      <p>Create a task from anywhere: Hit T on your keyboard</p>
      <Button variant="ghost" className="w-full text-left">
        <Mail className="h-4 w-4 mr-2" />
        Create a task from email
      </Button>
      <Button variant="ghost" className="w-full text-left">
        <Printer className="h-4 w-4 mr-2" />
        Print tasks
      </Button>
    </div> */}
  </div>
);

const PodioTaskManagement = () => {
  const [activeTab, setActiveTab] = useState("my-tasks");

  const myTasks = [
    { title: "Complete wireframe creation" },
    { title: "Review project proposal" },
  ];
  const delegatedTasks = [{ title: "Prepare client presentation" }];
  const completedTasks = [
    { title: "Create demo workspace" },
    { title: "Update team documentation" },
  ];
  const allCompletedTasks = [
    ...completedTasks,
    { title: "Finalize Q1 report" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-4 flex">
        <div className="flex-grow mr-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="my-tasks" className="flex-grow">
                My tasks
              </TabsTrigger>
              <TabsTrigger value="delegated-tasks" className="flex-grow">
                My delegated tasks
              </TabsTrigger>
              <TabsTrigger value="completed-tasks" className="flex-grow">
                My completed tasks
              </TabsTrigger>
              <TabsTrigger value="all-completed" className="flex-grow">
                All completed
              </TabsTrigger>
            </TabsList>

            <TaskForm />

            <TabsContent value="my-tasks">
              <h2 className="text-xl font-semibold mb-2">Overdue</h2>
              <TaskList tasks={myTasks} />
            </TabsContent>

            <TabsContent value="delegated-tasks">
              <h2 className="text-xl font-semibold mb-2">My Delegated Tasks</h2>
              <TaskList tasks={delegatedTasks} />
            </TabsContent>

            <TabsContent value="completed-tasks">
              <h2 className="text-xl font-semibold mb-2">My Completed Tasks</h2>
              <TaskList tasks={completedTasks} />
            </TabsContent>

            <TabsContent value="all-completed">
              <h2 className="text-xl font-semibold mb-2">
                All Completed Tasks
              </h2>
              <TaskList tasks={allCompletedTasks} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-1/4">
          <LabelSection />
        </div>
      </div>
    </div>
  );
};

export default PodioTaskManagement;
