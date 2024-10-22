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
  const [invitations, setInvitations] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchInvitations();
  }, []);

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

  const handleAddInvitation = (newInvitation) => {
    setInvitations([...invitations, newInvitation]);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox id="select-all" />
          <label htmlFor="select-all" className="text-2xl font-semibold">
            Invitations{" "}
            <span className="text-gray-500 text-lg font-normal">
              (All {invitations.length})
            </span>
          </label>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search invitations"
              className="pl-10 pr-4 py-2"
            />
          </div>
          <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>
            + INVITE TO WORKSPACE
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div className="flex items-center space-x-4">
              <Checkbox id={`invitation-${invitation.id}`} />
              <Avatar className="w-12 h-12">
                <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-xl font-semibold">
                  {invitation.recipient_email[0].toUpperCase()}
                </div>
              </Avatar>
              <div>
                <h2 className="font-semibold text-blue-600">
                  {invitation.recipient_email}
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="w-4 h-4 mr-2" />
                  {invitation.status}
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
        onAddConnection={handleAddInvitation}
      />
    </div>
  );
};

export default Connections;
