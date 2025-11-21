// components/common/log-measurements.tsx
"use client";

import { useState } from "react";
import { BottomSheet } from "./bottom-sheet";

interface LogMeasurementsProps {
  isOpen: boolean;
  onClose: () => void;
}

type MeasurementType = "arms-left" | "arms-right" | "waist" | "hips" | "butt" | "thighs-left" | "thighs-right";

const measurementLabels: Record<MeasurementType, string> = {
  "arms-left": "Arms (Left)",
  "arms-right": "Arms (Right)",
  waist: "Waist",
  hips: "Hips",
  butt: "Butt",
  "thighs-left": "Thighs (Left)",
  "thighs-right": "Thighs (Right)",
};

export function LogMeasurements({ isOpen, onClose }: LogMeasurementsProps) {
  const [measurements, setMeasurements] = useState<Record<MeasurementType, string>>({
    "arms-left": "",
    "arms-right": "",
    waist: "",
    hips: "",
    butt: "",
    "thighs-left": "",
    "thighs-right": "",
  });

  const handleMeasurementChange = (type: MeasurementType, value: string) => {
    setMeasurements((prev) => ({ ...prev, [type]: value }));
  };

  const handleSubmit = async () => {
    // TODO: Save measurements to API
    console.log("Log measurements:", measurements);
    alert("Measurements saved!");
    onClose();
  };

  const measurementTypes: MeasurementType[] = [
    "arms-left",
    "arms-right",
    "waist",
    "hips",
    "butt",
    "thighs-left",
    "thighs-right",
  ];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">Log Measurements</h2>
        </div>

        <div className="space-y-3">
          {measurementTypes.map((type) => (
            <div key={type}>
              <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                {measurementLabels[type]} (cm)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={measurements[type]}
                onChange={(e) => handleMeasurementChange(type, e.target.value)}
                placeholder="Enter measurement"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full rounded-lg bg-primary px-4 py-4 text-base font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Save All
        </button>
      </div>
    </BottomSheet>
  );
}

