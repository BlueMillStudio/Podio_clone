import React, { useState } from "react";
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
} from "lucide-react";

const TaskForm = () => (
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
    <Input
      className="mb-2"
      placeholder="Pick a connection or type an email address"
    />
    <div className="flex space-x-2 mb-2">
      <Button variant="outline" className="text-gray-500">
        No due date <ChevronDown className="h-4 w-4 ml-2" />
      </Button>
      <Button variant="outline" className="text-gray-500">
        <Clock className="h-4 w-4 mr-2" />
        --:--
      </Button>
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
      <Button variant="outline">Attach file</Button>
      <Button>Create task</Button>
    </div>
  </div>
);

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
      + NEW LABEL
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

  // Mock data - replace with actual data fetching logic
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
