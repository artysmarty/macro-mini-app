// components/dashboard/rewards-card.tsx
"use client";

export function RewardsCard() {
  const nextReward = {
    target: "2 lbs",
    bonus: "$5",
    progress: 60, // percentage
  };

  return (
    <div className="rounded-xl border border-gray-300 bg-gradient-to-br from-success/10 to-primary/10 p-4 shadow-card dark:border-dark-border dark:bg-dark-card dark:shadow-card-dark">
      <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-dark-text">
        Next Reward
      </h3>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        {nextReward.target} until {nextReward.bonus} bonus
      </p>
      
      {/* Progress Bar */}
      <div className="relative h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-success transition-all"
          style={{ width: `${nextReward.progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {nextReward.progress}% complete
      </p>
    </div>
  );
}

