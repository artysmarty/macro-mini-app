// components/common/log-measurements.tsx
"use client";

import { useState } from "react";
import { BottomSheet } from "./bottom-sheet";
import { useCreateMeasurementLog } from "@/hooks/use-measurement-logs";
import { useAuth } from "@/contexts/auth-context";
import { format } from "date-fns";
import type { BodyMeasurements } from "@/types";

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
  const { fid } = useAuth();
  const userId = getUserId(fid);
  const createMeasurementLog = useCreateMeasurementLog();
  const [measurements, setMeasurements] = useState<Record<MeasurementType, string>>({
    "arms-left": "",
    "arms-right": "",
    waist: "",
    hips: "",
    butt: "",
    "thighs-left": "",
    "thighs-right": "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleMeasurementChange = (type: MeasurementType, value: string) => {
    setMeasurements((prev) => ({ ...prev, [type]: value }));
  };

  const handleSubmit = async () => {
    // Convert measurements to BodyMeasurements format
    // Calculate average for arms and thighs if both sides are provided
    const armsLeft = parseFloat(measurements["arms-left"]) || 0;
    const armsRight = parseFloat(measurements["arms-right"]) || 0;
    const arms = armsLeft && armsRight ? (armsLeft + armsRight) / 2 : (armsLeft || armsRight);
    
    const thighsLeft = parseFloat(measurements["thighs-left"]) || 0;
    const thighsRight = parseFloat(measurements["thighs-right"]) || 0;
    const thighs = thighsLeft && thighsRight ? (thighsLeft + thighsRight) / 2 : (thighsLeft || thighsRight);

    const bodyMeasurements: BodyMeasurements = {
      waist: parseFloat(measurements.waist) || undefined,
      hips: parseFloat(measurements.hips) || undefined,
      chest: undefined, // Not in the form, but can be added later
      arms: arms || undefined,
      thighs: thighs || undefined,
      butt: parseFloat(measurements.butt) || undefined,
    };

    // Check if at least one measurement is provided
    const hasAnyMeasurement = Object.values(bodyMeasurements).some(v => v !== undefined);
    if (!hasAnyMeasurement) {
      alert("Please enter at least one measurement.");
      return;
    }

    setIsSaving(true);
    try {
      await createMeasurementLog.mutateAsync({
        userId,
        date: format(new Date(), "yyyy-MM-dd"),
        measurements: bodyMeasurements,
      });
      // Reset form
      setMeasurements({
        "arms-left": "",
        "arms-right": "",
        waist: "",
        hips: "",
        butt: "",
        "thighs-left": "",
        "thighs-right": "",
      });
      onClose();
    } catch (error) {
      console.error("Error logging measurements:", error);
      alert("Failed to log measurements. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
          disabled={isSaving}
          className="w-full rounded-lg bg-primary px-4 py-4 text-base font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save All"}
        </button>
      </div>
    </BottomSheet>
  );
}

