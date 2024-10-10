import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const LabelSection = () => (
  <div className="bg-white p-4 rounded-md">
    <h2 className="text-xl font-semibold mb-4">Labels</h2>
    <Button variant="outline" className="w-full mb-4">
      <Plus className="h-4 w-4 mr-2" />
      NEW LABEL
    </Button>
  </div>
);

export default LabelSection;
