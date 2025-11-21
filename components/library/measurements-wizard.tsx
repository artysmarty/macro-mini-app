// components/library/measurements-wizard.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Ruler } from "lucide-react";
import { useAccount } from "wagmi";
import { format } from "date-fns";

interface MeasurementsData {
  armLeft?: number;
  armRight?: number;
  thighLeft?: number;
  thighRight?: number;
  waist?: number;
  hips?: number;
  chest?: number;
}

type MeasurementStep =
  | "arm-left"
  | "arm-right"
  | "thigh-left"
  | "thigh-right"
  | "waist"
  | "hips"
  | "chest"
  | "complete";

interface MeasurementsWizardProps {
  onBack: () => void;
  onComplete?: (measurements: MeasurementsData) => void;
}

const steps: { key: MeasurementStep; label: string; unit: string }[] = [
  { key: "arm-left", label: "Left Arm", unit: "cm" },
  { key: "arm-right", label: "Right Arm", unit: "cm" },
  { key: "thigh-left", label: "Left Thigh", unit: "cm" },
  { key: "thigh-right", label: "Right Thigh", unit: "cm" },
  { key: "waist", label: "Waist", unit: "cm" },
  { key: "hips", label: "Hips", unit: "cm" },
  { key: "chest", label: "Chest", unit: "cm" },
];

export function MeasurementsWizard({ onBack, onComplete }: MeasurementsWizardProps) {
  const { address } = useAccount();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [measurements, setMeasurements] = useState<MeasurementsData>({});

  const currentStep = steps[currentStepIndex];
  const currentValue = measurements[currentStep?.key as keyof MeasurementsData] || "";

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      onBack();
    }
  };

  const handleComplete = async () => {
    try {
      // TODO: Save measurements to API
      // await fetch("/api/measurements", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     userId: address,
      //     date: format(new Date(), "yyyy-MM-dd"),
      //     measurements,
      //   }),
      // });

      if (onComplete) {
        onComplete(measurements);
      }
    } catch (error) {
      console.error("Error saving measurements:", error);
      alert("Failed to save measurements");
    }
  };

  const handleValueChange = (value: string) => {
    const numValue = value === "" ? undefined : parseFloat(value);
    setMeasurements({
      ...measurements,
      [currentStep.key]: numValue,
    });
  };

  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const canProceed = currentValue !== "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="mb-2 text-2xl font-bold">Add Measurements</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track your body measurements for better progress insights
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Measurement Input */}
      <div className="space-y-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <Ruler className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="mb-2 text-2xl font-bold">{currentStep.label}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Measure around the widest part
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentStep.label} ({currentStep.unit})
          </label>
          <input
            type="number"
            value={currentValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Enter measurement"
            step="0.1"
            min="0"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-3xl font-bold dark:border-gray-600 dark:bg-gray-700"
            autoFocus
          />
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Optional - press Enter or Next to skip
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={handlePrevious}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {currentStepIndex === 0 ? "Back" : "Previous"}
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onKeyDown={(e) => {
            if (e.key === "Enter" && canProceed) {
              handleNext();
            }
          }}
        >
          {currentStepIndex === steps.length - 1 ? "Complete" : "Next"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Summary (optional) */}
      {currentStepIndex === steps.length - 1 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/50">
          <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Summary:</p>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            {steps.map((step) => {
              const value = measurements[step.key as keyof MeasurementsData];
              return (
                <div key={step.key} className="flex justify-between">
                  <span className="capitalize">{step.label}:</span>
                  <span className="font-medium">
                    {value ? `${value} ${step.unit}` : "Not recorded"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

