// components/profile/workouts-section.tsx
"use client";

import { useState } from "react";
import { Activity, Flame, Clock, Dumbbell } from "lucide-react";

type TimePeriod = "today" | "7days" | "monthly" | "yeartodate";

interface WorkoutData {
  totalCaloriesBurned: number;
  totalTimeSpent: number; // in minutes
  numberOfWorkouts: number;
}

// Mock workout data - will be replaced with actual fitness watch data
const mockWorkoutData: Record<TimePeriod, WorkoutData> = {
  today: {
    totalCaloriesBurned: 450,
    totalTimeSpent: 60,
    numberOfWorkouts: 1,
  },
  "7days": {
    totalCaloriesBurned: 2850,
    totalTimeSpent: 420,
    numberOfWorkouts: 7,
  },
  monthly: {
    totalCaloriesBurned: 12400,
    totalTimeSpent: 1800,
    numberOfWorkouts: 30,
  },
  yeartodate: {
    totalCaloriesBurned: 48600,
    totalTimeSpent: 7200,
    numberOfWorkouts: 120,
  },
};

export function WorkoutsSection() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("7days");
  const data = mockWorkoutData[timePeriod];

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const periods: { value: TimePeriod; label: string }[] = [
    { value: "today", label: "Today" },
    { value: "7days", label: "7 Days" },
    { value: "monthly", label: "Monthly" },
    { value: "yeartodate", label: "Year to Date" },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-semibold">Workouts</h3>
      </div>

      {/* Time Period Toggle */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => setTimePeriod(period.value)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              timePeriod === period.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Stats - Compact Layout */}
      <div className="space-y-2">
        {/* Total Calories Burned */}
        <div className="flex items-center justify-between rounded-lg bg-orange-50 px-3 py-2 dark:bg-orange-900/20">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Calories Burned
            </span>
          </div>
          <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
            {data.totalCaloriesBurned.toLocaleString()}
          </span>
        </div>

        {/* Total Time Spent */}
        <div className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Time Spent
            </span>
          </div>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {formatTime(data.totalTimeSpent)}
          </span>
        </div>

        {/* Number of Workouts Completed */}
        <div className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 dark:bg-green-900/20">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Number of Workouts Completed
            </span>
          </div>
          <span className="text-sm font-bold text-green-600 dark:text-green-400">
            {data.numberOfWorkouts}
          </span>
        </div>
      </div>

      {/* Fitness Watch Connection Note */}
      <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-700/50 dark:text-gray-400">
        <p>
          📱 Connect your fitness watch in Settings to sync workout data
        </p>
      </div>
    </div>
  );
}

