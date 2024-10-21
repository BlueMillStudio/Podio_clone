import React, { useState, useEffect } from "react";
import {
  addDays,
  startOfWeek,
  endOfWeek,
  format,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import axios from "axios";
import { toast } from "sonner";

const Calendar = () => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks. Please try again.");
    }
  };

  const handleDateChange = (amount) => {
    setDate((prevDate) =>
      view === "month"
        ? amount > 0
          ? addMonths(prevDate, 1)
          : subMonths(prevDate, 1)
        : addDays(prevDate, amount * 7)
    );
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={() => setDate(new Date())}>
          Today
        </Button>
        <Button variant="outline" onClick={() => handleDateChange(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={() => handleDateChange(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {view === "month"
            ? format(date, "MMMM yyyy")
            : view === "week"
            ? `${format(startOfWeek(date), "MMM d")} - ${format(
                endOfWeek(date),
                "MMM d, yyyy"
              )}`
            : format(date, "EEEE, MMM d, yyyy")}
        </h2>
      </div>
      <div className="flex space-x-2">
        <Button
          variant={view === "month" ? "secondary" : "outline"}
          onClick={() => setView("month")}
        >
          Month
        </Button>
        <Button
          variant={view === "week" ? "secondary" : "outline"}
          onClick={() => setView("week")}
        >
          Week
        </Button>
        <Button
          variant={view === "day" ? "secondary" : "outline"}
          onClick={() => setView("day")}
        >
          Day
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-4 h-[calc(100vh-4rem)] flex flex-col bg-white">
      {renderHeader()}
      <div className="flex-grow overflow-auto">
        {view === "month" && <MonthView date={date} tasks={tasks} />}
        {view === "week" && <WeekView date={date} tasks={tasks} />}
        {view === "day" && <DayView date={date} tasks={tasks} />}
      </div>
    </div>
  );
};

export default Calendar;
