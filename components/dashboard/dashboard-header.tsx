// components/dashboard/dashboard-header.tsx
"use client";

interface DashboardHeaderProps {
  displayName?: string;
}

export function DashboardHeader({ displayName }: DashboardHeaderProps) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Welcome back, {displayName || "User"}!
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Let&apos;s hit those macros today 💪
      </p>
    </div>
  );
}

