// components/dashboard/streaks-grid.tsx
"use client";

import { Flame } from "lucide-react";

export function StreaksGrid() {
  const streaks = [
    { type: "Macros", count: 7, unit: "days", color: "text-success" },
    { type: "Weigh-in", count: 14, unit: "days", color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {streaks.map((streak) => (
        <button
          key={streak.type}
          onClick={() => {
            // TODO: Open streak details
            console.log(`Open ${streak.type} streak details`);
          }}
          className="rounded-xl border border-gray-300 bg-white p-4 text-left shadow-card transition-colors hover:bg-gray-50 dark:border-dark-border dark:bg-dark-card dark:hover:bg-dark-hover dark:shadow-card-dark"
        >
          <div className="mb-2 flex items-center gap-2">
            <Flame className={`h-5 w-5 ${streak.color}`} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {streak.type} Streak
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-dark-text">
            {streak.count}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{streak.unit}</div>
        </button>
      ))}
    </div>
  );
}

