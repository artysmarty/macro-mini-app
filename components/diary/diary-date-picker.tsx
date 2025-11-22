// components/diary/diary-date-picker.tsx
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { MonthlyCalendarView } from "./monthly-calendar-view";

interface DiaryDatePickerProps {
  onDateChange?: (date: Date) => void;
}

export function DiaryDatePicker({ onDateChange }: DiaryDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    onDateChange?.(selectedDate);
  }, [selectedDate, onDateChange]);

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
    setShowCalendar(false);
  };

  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={previousDay}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => setShowCalendar(true)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-gray-200 dark:hover:bg-dark-hover"
        >
          <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium">
            {format(selectedDate, "EEE, MMM d")}
          </span>
          {isToday && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              Today
            </span>
          )}
        </button>

        <button
          onClick={nextDay}
          disabled={isToday}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-200 disabled:opacity-50 dark:hover:bg-dark-hover"
        >
          <ChevronRight className="h-4 w-4" />
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

