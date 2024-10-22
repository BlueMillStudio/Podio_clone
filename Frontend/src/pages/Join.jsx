import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

const Join = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState(null);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("No invitation token provided");
      return;
    }
    verifyInvitation();
  }, [token]);

  const verifyInvitation = async () => {
    try {
      console.log("Verifying token:", token);
      const response = await axios.get(
        `http://localhost:5000/api/invitations/verify?token=${token}`
      );
      console.log("Verification response:", response.data);
      setInvitation(response.data);
    } catch (error) {
      console.error(
        "Verification error:",
        error.response?.data || error.message
      );
      setError(error.response?.data?.error || "Invalid or expired invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/invitations/accept",
        { token: searchParams.get("token") }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Successfully joined organization");
      navigate("/dashboard");
    } catch (error) {
      console.error("Join error:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to accept invitation";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-[400px]">
          <CardContent className="p-6 text-center">
            <div className="animate-pulse">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-[400px]">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-red-600 mb-4">{error}</div>
              <Button onClick={() => navigate("/")} variant="outline">
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Join Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-medium">{invitation?.organization_name}</h3>
            <p className="text-sm text-gray-500">
              You've been invited to join this organization.
            </p>
            {invitation?.organization_details && (
              <div className="mt-2 text-sm">
                <p>Industry: {invitation.organization_details.industry}</p>
                <p>Size: {invitation.organization_details.size}</p>
              </div>
            )}
          </div>
          <Button onClick={handleJoin} className="w-full" disabled={isLoading}>
            {isLoading ? "Joining..." : "Accept Invitation"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Join;
