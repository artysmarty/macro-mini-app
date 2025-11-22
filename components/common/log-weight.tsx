// components/common/log-weight.tsx
"use client";

import { useState } from "react";
import { BottomSheet } from "./bottom-sheet";
import { useCreateWeightLog } from "@/hooks/use-weight-logs";
import { useAuth } from "@/contexts/auth-context";
import { format } from "date-fns";

// Helper function to get consistent userId
function getUserId(fid: number | null | undefined): string {
  if (fid) {
    return `fid-${fid}`;
  }
  if (typeof window !== 'undefined') {
    let devUserId = localStorage.getItem('devUserId');
    if (!devUserId) {
      devUserId = `fid-dev-${Date.now()}`;
      localStorage.setItem('devUserId', devUserId);
    }
    return devUserId;
  }
  return `fid-dev-${Date.now()}`;
}

interface LogWeightProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogWeight({ isOpen, onClose }: LogWeightProps) {
  const { fid } = useAuth();
  const userId = getUserId(fid);
  const createWeightLog = useCreateWeightLog();
  const [weight, setWeight] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    const weightNum = parseFloat(weight);
    if (!weight || weightNum <= 0) {
      return;
    }

    setIsSaving(true);
    try {
      await createWeightLog.mutateAsync({
        userId,
        date: format(new Date(), "yyyy-MM-dd"),
        weight: weightNum,
        source: "manual",
      });
      setWeight("");
      onClose();
    } catch (error) {
      console.error("Error logging weight:", error);
      alert("Failed to log weight. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
          disabled={!weight || parseFloat(weight) <= 0 || isSaving}
          className="w-full rounded-lg bg-primary px-4 py-4 text-base font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </BottomSheet>
  );
}

