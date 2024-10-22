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

  // Separate useEffect for setting the logged user ID
  useEffect(() => {
    const initializeUser = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setLoggedUserId(decodedToken.userId);
        } catch (error) {
          console.error("Error decoding token:", error);
          toast.error("Authentication error. Please login again.");
        }
      }
    };

    initializeUser();
  }, []); // Run only once on component mount

  // Separate useEffect for fetching data that depends on loggedUserId
  useEffect(() => {
    if (loggedUserId) {
      // Only fetch if we have a logged user ID
      fetchUsers();
      fetchTasks();
    }
  }, [loggedUserId]); // Run when loggedUserId changes

  const fetchTasks = async () => {
    if (!loggedUserId) return; // Guard clause

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
      console.log("User Tasks:", userTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!loggedUserId) return; // Guard clause

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

  // Custom hook to handle task updates
  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const filterTasks = (status) => {
    if (!tasks) return [];
    return tasks.filter((task) => task.status === status);
  };

  // Loading state while user ID is being fetched
  if (!loggedUserId) {
    return <div>Initializing...</div>;
  }

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

            <TaskForm
              onTaskCreated={handleTaskCreated}
              users={users}
              loggedUserId={loggedUserId} // Pass loggedUserId to TaskForm
            />

            <TabsContent value="my-tasks">
              <h2 className="text-xl font-semibold mb-2">My Tasks</h2>
              {isLoading ? (
                <p>Loading tasks...</p>
              ) : (
                <TaskList
                  tasks={filterTasks("pending")}
                  onTaskUpdate={handleTaskUpdate}
                  loggedUserId={loggedUserId} // Pass loggedUserId to TaskList
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
                  loggedUserId={loggedUserId}
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
                  loggedUserId={loggedUserId}
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
                  loggedUserId={loggedUserId}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-1/4">
          <LabelSection loggedUserId={loggedUserId} />
        </div>
      </div>
    </div>
  );
};

export default PodioTaskManagement;
