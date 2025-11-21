// components/dashboard/streak-calendar.tsx
"use client";

export function StreakCalendar() {
  // Mock data for now
  const currentStreaks = {
    macros: 5,
    weighins: 8,
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold">Streaks</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">Macros Hit</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {currentStreaks.macros} days
          </p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">Weigh-ins</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {currentStreaks.weighins} days
          </p>
        </div>
      </div>
    </div>
  );
}

