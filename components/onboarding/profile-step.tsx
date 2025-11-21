// components/onboarding/profile-step.tsx
"use client";

import { useState } from "react";
import type { User } from "@/types";

interface ProfileStepProps {
  data: Partial<User>;
  onUpdate: (updates: Partial<User>) => void;
}

export function ProfileStep({ data, onUpdate }: ProfileStepProps) {
  const [age, setAge] = useState(data.age?.toString() || "");
  const [height, setHeight] = useState(data.height?.toString() || "");
  const [weight, setWeight] = useState(data.weight?.toString() || "");
  const [gender, setGender] = useState<User["gender"]>(data.gender || "male");

  const handleUpdate = () => {
    onUpdate({
      age: age ? parseInt(age) : undefined,
      height: height ? parseFloat(height) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      gender,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold">Tell us about yourself</h2>
        <p className="text-gray-600 dark:text-gray-400">
          We&apos;ll use this to calculate your ideal macros.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
              handleUpdate();
            }}
            onBlur={handleUpdate}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            placeholder="25"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
              handleUpdate();
            }}
            onBlur={handleUpdate}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            placeholder="175"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              handleUpdate();
            }}
            onBlur={handleUpdate}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            placeholder="75"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Gender</label>
          <div className="flex gap-4">
            {(["male", "female", "other"] as const).map((g) => (
              <button
                key={g}
                onClick={() => {
                  setGender(g);
                  handleUpdate();
                }}
                className={`flex-1 rounded-lg border-2 px-4 py-2 capitalize transition-colors ${
                  gender === g
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

