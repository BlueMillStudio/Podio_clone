import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";

const AddConnectionModal = ({ isOpen, onClose, onAddConnection }) => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchOrganizations();
    }
  }, [isOpen]);

  const fetchOrganizations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://pp-tynr.onrender.com/api/organizations/user-organizations",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Fetched organizations:", response.data);
      // Ensure organizations is an array
      const orgs = response.data.organizations || [];
      setOrganizations(orgs);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to fetch organizations. Please try again later.");
      setOrganizations([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) {
      toast.error("Please select an organization or workspace");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://pp-tynr.onrender.com/api/connections/invite",
        {
          organizationId:
            selectedItem.type === "org" ? selectedItem.id : selectedItem.orgId,
          workspaceId: selectedItem.type === "ws" ? selectedItem.id : null,
          email,
          message,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      onAddConnection(response.data);
      toast.success("Invitation sent successfully");
      onClose();
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Connection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Select
            onValueChange={(value) => setSelectedItem(JSON.parse(value))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select organization or workspace" />
            </SelectTrigger>
            <SelectContent>
              {organizations.length > 0 ? (
                organizations.map((org) => (
                  <React.Fragment key={org.id}>
                    <SelectItem
                      value={JSON.stringify({ type: "org", id: org.id })}
                    >
                      {org.name} (Organization)
                    </SelectItem>
                    {Array.isArray(org.workspaces) &&
                      org.workspaces.map((workspace) => (
                        <SelectItem
                          key={workspace.id}
                          value={JSON.stringify({
                            type: "ws",
                            id: workspace.id,
                            orgId: org.id,
                          })}
                        >
                          {workspace.name} (Workspace)
                        </SelectItem>
                      ))}
                  </React.Fragment>
                ))
              ) : (
                <SelectItem value="no-org" disabled>
                  No organizations available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-4"
          />
          <Textarea
            placeholder="Enter invitation message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-4"
          />
          <div className="flex justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mr-2"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || organizations.length === 0}
            >
              {isLoading ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddConnectionModal;
