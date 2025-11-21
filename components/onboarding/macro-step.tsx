// components/onboarding/macro-step.tsx
"use client";

import { useState, useEffect } from "react";
import type { User } from "@/types";
import { calculateMacros } from "@/lib/macro-calculator";
import type { MacroTargets } from "@/lib/macro-calculator";

interface MacroStepProps {
  data: Partial<User>;
  onUpdate: (updates: Partial<User>) => void;
}

export function MacroStep({ data, onUpdate }: MacroStepProps) {
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [calculatedMacros, setCalculatedMacros] = useState<MacroTargets | null>(null);

  useEffect(() => {
    if (mode === "auto" && data.weight && data.height && data.age && data.gender && data.goal) {
      try {
        const user = data as User;
        const macros = calculateMacros(user);
        setCalculatedMacros(macros);
        // TODO: Save calculated macros
      } catch (error) {
        console.error("Error calculating macros:", error);
      }
    }
  }, [mode, data]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold">Your Macros</h2>
        <p className="text-gray-600 dark:text-gray-400">
          We can calculate your ideal macros or you can set them manually.
        </p>
      </div>

      <div className="flex gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
        <button
          onClick={() => setMode("auto")}
          className={`flex-1 rounded px-4 py-2 font-medium transition-colors ${
            mode === "auto"
              ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Calculate for me
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`flex-1 rounded px-4 py-2 font-medium transition-colors ${
            mode === "manual"
              ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          I know my macros
        </button>
      </div>

      {mode === "auto" && calculatedMacros ? (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 font-semibold">Recommended Macros</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Calories</span>
              <span className="font-semibold">{calculatedMacros.calories} kcal</span>
            </div>
            <div className="flex justify-between">
              <span>Protein</span>
              <span className="font-semibold">{calculatedMacros.proteinG}g</span>
            </div>
            <div className="flex justify-between">
              <span>Carbs</span>
              <span className="font-semibold">{calculatedMacros.carbsG}g</span>
            </div>
            <div className="flex justify-between">
              <span>Fats</span>
              <span className="font-semibold">{calculatedMacros.fatsG}g</span>
            </div>
          </div>
        </div>
      ) : mode === "manual" ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You can set your macros later in Settings.
          </p>
        </div>
      ) : (
        <div className="text-center text-gray-600 dark:text-gray-400">
          Calculating your ideal macros...
        </div>
      )}
    </div>
  );
}

