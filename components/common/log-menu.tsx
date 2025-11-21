// components/common/log-menu.tsx
"use client";

import { useState } from "react";
import { BottomSheet } from "./bottom-sheet";
import { LogWeight } from "./log-weight";
import { LogMeasurements } from "./log-measurements";

interface LogMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogMenu({ isOpen, onClose }: LogMenuProps) {
  const [selectedType, setSelectedType] = useState<"weight" | "measurements" | null>(null);

  if (selectedType === "weight") {
    return <LogWeight isOpen={isOpen} onClose={() => { setSelectedType(null); onClose(); }} />;
  }

  if (selectedType === "measurements") {
    return <LogMeasurements isOpen={isOpen} onClose={() => { setSelectedType(null); onClose(); }} />;
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Log">
      <div className="space-y-3">
        <button
          onClick={() => setSelectedType("weight")}
          className="flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-4 text-left font-medium transition-colors hover:bg-gray-100 dark:border-dark-border dark:bg-dark-card dark:hover:bg-dark-hover"
        >
          Weight
        </button>
        <button
          onClick={() => setSelectedType("measurements")}
          className="flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-4 text-left font-medium transition-colors hover:bg-gray-100 dark:border-dark-border dark:bg-dark-card dark:hover:bg-dark-hover"
        >
          Measurements
        </button>
      </div>
    </BottomSheet>
  );
}

