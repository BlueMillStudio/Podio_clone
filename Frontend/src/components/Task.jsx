import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import LabelSection from "./LableSection";
import axios from "axios";

const PodioTaskManagement = () => {
  const [activeTab, setActiveTab] = useState("my-tasks");
  const [tasks, setTasks] = useState({
    myTasks: [],
    delegatedTasks: [],
    completedTasks: [],
    allCompletedTasks: [],
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      const allTasks = response.data;

      setTasks({
        myTasks: allTasks.filter((task) => !task.completed),
        delegatedTasks: allTasks.filter((task) => task.delegated),
        completedTasks: allTasks.filter((task) => task.completed),
        allCompletedTasks: allTasks.filter((task) => task.completed),
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      myTasks: [...prevTasks.myTasks, newTask],
    }));
  };

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

            <TaskForm onTaskCreated={handleTaskCreated} />

            <TabsContent value="my-tasks">
              <h2 className="text-xl font-semibold mb-2">My Tasks</h2>
              <TaskList tasks={tasks.myTasks} />
            </TabsContent>

            <TabsContent value="delegated-tasks">
              <h2 className="text-xl font-semibold mb-2">My Delegated Tasks</h2>
              <TaskList tasks={tasks.delegatedTasks} />
            </TabsContent>

            <TabsContent value="completed-tasks">
              <h2 className="text-xl font-semibold mb-2">My Completed Tasks</h2>
              <TaskList tasks={tasks.completedTasks} />
            </TabsContent>

            <TabsContent value="all-completed">
              <h2 className="text-xl font-semibold mb-2">
                All Completed Tasks
              </h2>
              <TaskList tasks={tasks.allCompletedTasks} />
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
