// components/onboarding/goal-step.tsx
"use client";

import { useState } from "react";
import type { User } from "@/types";

interface GoalStepProps {
  data: Partial<User>;
  onUpdate: (updates: Partial<User>) => void;
}

const goals: { value: User["goal"]; label: string; description: string }[] = [
  {
    value: "lose_weight",
    label: "Lose Weight",
    description: "Create a calorie deficit to lose fat",
  },
  {
    value: "gain_muscle",
    label: "Gain Muscle",
    description: "Increase calories and protein for muscle growth",
  },
  {
    value: "recomposition",
    label: "Recomposition",
    description: "Lose fat while gaining muscle",
  },
  {
    value: "maintain",
    label: "Maintain",
    description: "Keep your current weight and composition",
  },
];

const activityLevels: { value: User["activityLevel"]; label: string; description: string }[] = [
  { value: "sedentary", label: "Sedentary", description: "Little to no exercise" },
  { value: "light", label: "Light", description: "Light exercise 1-3 days/week" },
  { value: "moderate", label: "Moderate", description: "Moderate exercise 3-5 days/week" },
  { value: "high", label: "High", description: "Intense exercise 6-7 days/week" },
];

export function GoalStep({ data, onUpdate }: GoalStepProps) {
  const [goal, setGoal] = useState<User["goal"]>(data.goal);
  const [activityLevel, setActivityLevel] = useState<User["activityLevel"]>(data.activityLevel);

  const handleUpdate = () => {
    onUpdate({ goal, activityLevel });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold">What&apos;s your goal?</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose your primary fitness goal.
        </p>
      </div>

      <div className="space-y-3">
        {goals.map((g) => (
          <button
            key={g.value}
            onClick={() => {
              setGoal(g.value);
              handleUpdate();
            }}
            className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${
              goal === g.value
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <div className="font-semibold">{g.label}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{g.description}</div>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold">Activity Level</h3>
        <div className="space-y-2">
          {activityLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => {
                setActivityLevel(level.value);
                handleUpdate();
              }}
              className={`w-full rounded-lg border-2 p-3 text-left transition-colors ${
                activityLevel === level.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <div className="font-medium">{level.label}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{level.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

