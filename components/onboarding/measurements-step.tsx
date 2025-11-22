// components/onboarding/measurements-step.tsx
"use client";

import { useState } from "react";
import type { BodyMeasurements } from "@/types";

interface MeasurementsStepProps {
  data?: BodyMeasurements;
  onUpdate: (measurements: BodyMeasurements) => void;
}

export function MeasurementsStep({ data, onUpdate }: MeasurementsStepProps) {
  const [measurements, setMeasurements] = useState<Record<keyof BodyMeasurements, string>>({
    waist: data?.waist?.toString() || "",
    chest: data?.chest?.toString() || "",
    hips: data?.hips?.toString() || "",
    arms: data?.arms?.toString() || "",
    thighs: data?.thighs?.toString() || "",
    butt: data?.butt?.toString() || "",
  });

  const handleChange = (key: keyof BodyMeasurements, value: string) => {
    const updated = { ...measurements, [key]: value };
    setMeasurements(updated);
    onUpdate({
      waist: updated.waist ? parseFloat(updated.waist) : undefined,
      chest: updated.chest ? parseFloat(updated.chest) : undefined,
      hips: updated.hips ? parseFloat(updated.hips) : undefined,
      arms: updated.arms ? parseFloat(updated.arms) : undefined,
      thighs: updated.thighs ? parseFloat(updated.thighs) : undefined,
      butt: updated.butt ? parseFloat(updated.butt) : undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold">Body Measurements</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Optional: Track your body measurements for better progress insights.
        </p>
      </div>

      <div className="space-y-4">
        {[
          { key: "waist" as const, label: "Waist (cm)" },
          { key: "chest" as const, label: "Chest (cm)" },
          { key: "hips" as const, label: "Hips (cm)" },
          { key: "arms" as const, label: "Arms (cm)" },
          { key: "thighs" as const, label: "Thighs (cm)" },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="mb-2 block text-sm font-medium">{label}</label>
            <input
              type="number"
              value={measurements[key] || ""}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Optional"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

