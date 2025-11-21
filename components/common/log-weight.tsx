// components/common/log-weight.tsx
"use client";

import { useState } from "react";
import { BottomSheet } from "./bottom-sheet";
import { X } from "lucide-react";

interface LogWeightProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogWeight({ isOpen, onClose }: LogWeightProps) {
  const [weight, setWeight] = useState("");

  const handleSubmit = async () => {
    // TODO: Save weight to API
    console.log("Log weight:", weight);
    alert(`Weight logged: ${weight} kg`);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">Log Weight</h2>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
            Weight (kg)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-2xl font-bold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
            autoFocus
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!weight || parseFloat(weight) <= 0}
          className="w-full rounded-lg bg-primary px-4 py-4 text-base font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </BottomSheet>
  );
}

