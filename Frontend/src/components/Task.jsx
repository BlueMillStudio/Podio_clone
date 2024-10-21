import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import LabelSection from "./LableSection";
import axios from "axios";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

const PodioTaskManagement = () => {
  const [activeTab, setActiveTab] = useState("my-tasks");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [loggedUserId, setLoggedUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setLoggedUserId(decodedToken.userId);
    }
    console.log(loggedUserId);
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const allTasks = response.data;
      const userTasks = allTasks.filter(
        (task) => task.creator_id === loggedUserId
      );

      setTasks(userTasks);
      console.log(userTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const filterTasks = (status) => {
    return tasks.filter((task) => task.status === status);
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

            <TaskForm onTaskCreated={handleTaskCreated} users={users} />

            <TabsContent value="my-tasks">
              <h2 className="text-xl font-semibold mb-2">My Tasks</h2>
              {isLoading ? (
                <p>Loading tasks...</p>
              ) : (
                <TaskList
                  tasks={filterTasks("pending")}
                  onTaskUpdate={handleTaskUpdate}
                />
              )}
            </TabsContent>

            <TabsContent value="delegated-tasks">
              <h2 className="text-xl font-semibold mb-2">My Delegated Tasks</h2>
              {isLoading ? (
                <p>Loading tasks...</p>
              ) : (
                <TaskList
                  tasks={filterTasks("delegated")}
                  onTaskUpdate={handleTaskUpdate}
                />
              )}
            </TabsContent>

            <TabsContent value="completed-tasks">
              <h2 className="text-xl font-semibold mb-2">My Completed Tasks</h2>
              {isLoading ? (
                <p>Loading tasks...</p>
              ) : (
                <TaskList
                  tasks={filterTasks("completed")}
                  onTaskUpdate={handleTaskUpdate}
                />
              )}
            </TabsContent>

            <TabsContent value="all-completed">
              <h2 className="text-xl font-semibold mb-2">
                All Completed Tasks
              </h2>
              {isLoading ? (
                <p>Loading tasks...</p>
              ) : (
                <TaskList
                  tasks={filterTasks("completed")}
                  onTaskUpdate={handleTaskUpdate}
                />
              )}
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
