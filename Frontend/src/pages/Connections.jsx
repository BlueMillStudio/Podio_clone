import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ChevronDown, Mail, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import AddConnectionModal from "./AddConnectionModal";
import axios from "axios";
import { toast } from "sonner";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await axios.get(
        "https://pp-tynr.onrender.com/api/connections",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setConnections(response.data);
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast.error("Failed to fetch connections");
    }
  };

  const handleAddConnection = (newConnection) => {
    setConnections([...connections, newConnection]);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox id="select-all" />
          <label htmlFor="select-all" className="text-2xl font-semibold">
            Connections{" "}
            <span className="text-gray-500 text-lg font-normal">
              (All {connections.length})
            </span>
          </label>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search connections"
              className="pl-10 pr-4 py-2"
            />
          </div>
          <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>
            + ADD CONNECTION
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {connections.map((connection) => (
          <div
            key={connection.id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div className="flex items-center space-x-4">
              <Checkbox id={`connection-${connection.id}`} />
              <Avatar className="w-12 h-12">
                {connection.avatarUrl ? (
                  <img
                    src={connection.avatarUrl}
                    // alt={connection.name}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-xl font-semibold">
                    {/* {connection.name[0]} */}
                  </div>
                )}
              </Avatar>
              <div>
                <h2 className="font-semibold text-blue-600">
                  {connection.name}
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="w-4 h-4 mr-2" />
                  {connection.email}
                </div>
              </div>
            </div>
            <Button variant="outline" className="text-gray-600">
              Actions <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <AddConnectionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddConnection={handleAddConnection}
      />
    </div>
  );
};

export default Connections;
