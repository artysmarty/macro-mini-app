// components/diary/diary-header.tsx
"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useState } from "react";
import { MonthlyCalendarView } from "./monthly-calendar-view";

export function DiaryHeader() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const previousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const nextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <button
          onClick={previousDay}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => setShowCalendar(true)}
          className="flex items-center gap-2 rounded-lg px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span className="font-semibold">
            {format(selectedDate, "EEEE, MMM d")}
          </span>
        </button>

        <button
          onClick={nextDay}
          disabled={format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")}
          className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {showCalendar && (
        <MonthlyCalendarView
          onClose={() => setShowCalendar(false)}
          onDateSelect={handleDateSelect}
        />
      )}
    </>
  );
}

