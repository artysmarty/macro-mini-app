// components/dashboard/macro-status-card.tsx
"use client";

import { useMacroLog } from "@/hooks/use-macro-log";
import { format } from "date-fns";

interface CircularProgressProps {
  consumed: number;
  target: number;
  color: string;
  label: string;
  unit: string;
}

function CircularProgress({ consumed, target, color, label, unit }: CircularProgressProps) {
  const percentage = Math.min((consumed / target) * 100, 100);
  const remainder = Math.max(target - consumed, 0);
  const circumference = 2 * Math.PI * 40; // radius = 40
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center">
        <svg width="90" height="90" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="45"
            cy="45"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="45"
            cy="45"
            r="40"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xs font-bold" style={{ color }}>
            {remainder.toFixed(0)}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400">remaining</div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</div>
      </div>
    </div>
  );
}

export function MacroStatusCard() {
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: macroLog, isLoading } = useMacroLog(today);

  // Mock data for now - will be replaced with actual API calls
  const targetMacros = {
    calories: 2400,
    protein: 180,
    carbs: 240,
    fats: 80,
  };

  const consumed = macroLog || {
    calories: 0,
    proteinG: 0,
    carbsG: 0,
    fatsG: 0,
  };

  if (isLoading) {
    return <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">Loading...</div>;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-3 text-sm font-semibold">Today&apos;s Macros</h2>
      
      {/* Single row of circular progress indicators */}
      <div className="flex justify-around">
        <CircularProgress
          consumed={consumed.calories}
          target={targetMacros.calories}
          color="#ec4899" // pink
          label="Calories"
          unit="kcal"
        />
        <CircularProgress
          consumed={consumed.proteinG}
          target={targetMacros.protein}
          color="#3b82f6" // blue
          label="Protein"
          unit="g"
        />
        <CircularProgress
          consumed={consumed.carbsG}
          target={targetMacros.carbs}
          color="#eab308" // yellow
          label="Carbs"
          unit="g"
        />
        <CircularProgress
          consumed={consumed.fatsG}
          target={targetMacros.fats}
          color="#10b981" // green
          label="Fats"
          unit="g"
        />
      </div>
    </div>
  );
}
