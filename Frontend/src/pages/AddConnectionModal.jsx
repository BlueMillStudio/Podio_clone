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
  const [selectedOrg, setSelectedOrg] = useState("");
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
        "http://localhost:5000/api/organizations/user-organizations",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Fetched organizations:", response.data);
      const orgs = response.data.organizations || [];
      setOrganizations(orgs);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to fetch organizations. Please try again later.");
      setOrganizations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrg) {
      toast.error("Please select an organization");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/invitations",
        {
          organizationId: selectedOrg,
          email,
          message,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Invitation response:", response.data);
      if (response.data && response.data.emailSent) {
        toast.success("Invitation email sent successfully");
        onAddConnection(response.data.invitation);
        onClose();
      } else {
        toast.error(
          "Invitation created, but email sending failed. Please try again or contact support."
        );
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Failed to send invitation: ${error.response.data.error}`);
      } else {
        toast.error(
          "Failed to send invitation. Please try again or check your network connection."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedOrg("");
      setEmail("");
      setMessage("");
    }
  }, [isOpen]);

  const handleOrgChange = (value) => {
    console.log("Selected org:", value);
    setSelectedOrg(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite to Organization</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select value={selectedOrg} onValueChange={handleOrgChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id.toString()}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Textarea
            placeholder="Enter invitation message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="flex justify-end pt-4">
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
