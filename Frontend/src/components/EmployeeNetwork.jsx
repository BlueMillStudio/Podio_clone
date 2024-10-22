import React, { useState, useEffect } from "react";
import { Search, User, Bell, Paperclip, LinkIcon, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import CreateTaskModal from "./CreateTaskModal";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";

const EmployeeNetwork = ({ workspace }) => {
  const [tasks, setTasks] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchInvitations();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
    }
  };

  const fetchInvitations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/invitations",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setInvitations(response.data);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast.error("Failed to fetch invitations");
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto py-6 flex gap-6">
        <div className="w-2/3 space-y-6">
          {/* Employees Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Employees {invitations.length}</span>
                <Button onClick={() => setIsCreateTaskModalOpen(true)}>
                  INVITE
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {invitation.recipient_email[0].toUpperCase()}
                  </div>
                  <span>{invitation.recipient_email}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Share Something Card */}
          <Card>
            <CardContent>
              <Input
                placeholder="Share something. Use @ to mention individuals."
                className="mb-4"
              />
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Paperclip className="h-5 w-5" />
                  <LinkIcon className="h-5 w-5" />
                  <List className="h-5 w-5" />
                </div>
                <Button>Share</Button>
              </div>
            </CardContent>
          </Card>

          {/* Tasks List */}
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox />
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(task.created_at), "PP")} ·{" "}
                      {task.creator_name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="w-1/3 space-y-6">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome to the Employee Network</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                A place to communicate with the entire organization. Use the
                activity stream to share status updates, files, questions, and
                links with all your co-workers.
              </p>
            </CardContent>
          </Card>

          {/* Tasks Card */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Network Tasks ({tasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p>No tasks to show</p>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-2">
                      <Checkbox />
                      <span>{task.title}</span>
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsCreateTaskModalOpen(true)}
              >
                + CREATE TASK
              </Button>
            </CardContent>
          </Card>

          {/* Files Card */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Network Files ({files.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {files.length === 0 ? (
                <p>No files to show</p>
              ) : (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center space-x-2">
                      <Paperclip className="h-4 w-4" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default EmployeeNetwork;
