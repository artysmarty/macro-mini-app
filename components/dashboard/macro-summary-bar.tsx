// components/dashboard/macro-summary-bar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useMacroLog } from "@/hooks/use-macro-log";
import { useAuth } from "@/contexts/auth-context";
import { format } from "date-fns";

interface CircularProgressProps {
  consumed: number;
  target: number;
  color: string;
  label: string;
  unit: string;
  showRemainder?: boolean;
}

function CircularProgress({ consumed, target, color, label, unit, showRemainder = true }: CircularProgressProps) {
  const percentage = Math.min((consumed / target) * 100, 100);
  const remaining = Math.max(target - consumed, 0);
  const radius = 40; // 40px radius
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const size = (radius + 7) * 2; // Total size accounting for stroke width

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="relative mb-2 flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="7"
            fill="none"
            className="text-gray-300 dark:text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="7"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {showRemainder ? (
            <>
              <div className="text-base font-bold text-gray-900 dark:text-dark-text">
                {remaining.toFixed(0)}
              </div>
              <div className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
                remaining
              </div>
            </>
          ) : (
            <>
              <div className="text-base font-bold" style={{ color }}>
                {remaining.toFixed(remaining < 10 ? 1 : 0)}
              </div>
              <div className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
                remaining
              </div>
            </>
          )}
        </div>
      </div>
      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</div>
    </div>
  );
}

interface MacroSummaryBarProps {
  onLogFoodClick?: () => void;
  date?: Date; // Optional date prop - defaults to today
}

export function MacroSummaryBar({ onLogFoodClick, date }: MacroSummaryBarProps) {
  const { fid } = useAuth();
  // Use provided date or default to today
  const displayDate = date || new Date();
  const dateString = format(displayDate, "yyyy-MM-dd");
  const [isMounted, setIsMounted] = useState(false);
  
  // Use consistent userId - match the logic from DiaryPage
  const getUserId = () => {
    if (fid) {
      return `fid-${fid}`;
    }
    // Use the same dev userId from localStorage (only on client)
    if (typeof window !== 'undefined' && isMounted) {
      const devUserId = localStorage.getItem('devUserId');
      return devUserId || "";
    }
    return "";
  };
  
  // Only get userId after component mounts to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const userId = getUserId();
  const { data: macroLog, isLoading } = useMacroLog(dateString, userId);
  const [viewIndex, setViewIndex] = useState(0); // 0 = macros, 1 = micros
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const targetMacros = {
    calories: 2400,
    protein: 180,
    carbs: 240,
    fats: 80,
  };

  const targetMicros = {
    fiber: 30, // g
    sodium: 2300, // mg
    sugar: 50, // g
  };

  const consumed = macroLog || {
    calories: 0,
    proteinG: 0,
    carbsG: 0,
    fatsG: 0,
    fiberG: 0,
    sodiumMg: 0,
    sugarG: 0,
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && viewIndex === 0) {
      setViewIndex(1); // Swipe left to show micros
    } else if (isRightSwipe && viewIndex === 1) {
      setViewIndex(0); // Swipe right to show macros
    }
  };

  // Don't show loading state until component is mounted to avoid hydration mismatch
  // Instead, show the default values (0 consumed)
  if (!isMounted || isLoading) {
    return (
      <div className="border-b border-gray-300 bg-white py-6 dark:border-dark-border dark:bg-dark-card overflow-hidden">
        <div className="flex w-full items-center transition-transform duration-300" style={{ transform: `translateX(-${viewIndex * 100}%)` }}>
          {/* Macros View - Show with 0 values during loading */}
          <div className="flex min-w-full items-center px-4 justify-between">
            <CircularProgress
              consumed={0}
              target={targetMacros.calories}
              color="#28CC8B"
              label="Cal"
              unit="kcal"
            />
            <CircularProgress
              consumed={0}
              target={targetMacros.protein}
              color="#3A7BFF"
              label="Protein"
              unit="g"
            />
            <CircularProgress
              consumed={0}
              target={targetMacros.carbs}
              color="#67C8FF"
              label="Carbs"
              unit="g"
            />
            <CircularProgress
              consumed={0}
              target={targetMacros.fats}
              color="#FFB74D"
              label="Fat"
              unit="g"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="border-b border-gray-300 bg-white py-6 dark:border-dark-border dark:bg-dark-card overflow-hidden"
    >
      <div className="flex w-full items-center transition-transform duration-300" style={{ transform: `translateX(-${viewIndex * 100}%)` }}>
        {/* Macros View */}
        <div className="flex min-w-full items-center px-4 justify-between">
          <CircularProgress
            consumed={consumed.calories}
            target={targetMacros.calories}
            color="#28CC8B"
            label="Cal"
            unit="kcal"
          />
          <CircularProgress
            consumed={consumed.proteinG}
            target={targetMacros.protein}
            color="#3A7BFF"
            label="Protein"
            unit="g"
          />
          <CircularProgress
            consumed={consumed.carbsG}
            target={targetMacros.carbs}
            color="#67C8FF"
            label="Carbs"
            unit="g"
          />
          <CircularProgress
            consumed={consumed.fatsG}
            target={targetMacros.fats}
            color="#FFB74D"
            label="Fat"
            unit="g"
          />
        </div>

        {/* Micros View */}
        <div className="flex min-w-full items-center px-4 justify-between">
          <CircularProgress
            consumed={consumed.fiberG || 0}
            target={targetMicros.fiber}
            color="#10b981"
            label="Fiber"
            unit="g"
            showRemainder={false}
          />
          <CircularProgress
            consumed={consumed.sodiumMg || 0}
            target={targetMicros.sodium}
            color="#f59e0b"
            label="Sodium"
            unit="mg"
            showRemainder={false}
          />
          <CircularProgress
            consumed={consumed.sugarG || 0}
            target={targetMicros.sugar}
            color="#ef4444"
            label="Sugar"
            unit="g"
            showRemainder={false}
          />
        </div>
      </div>

      {/* Page indicators - removed */}
    </div>
  );
}

