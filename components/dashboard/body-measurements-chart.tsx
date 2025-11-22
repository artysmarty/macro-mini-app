// components/dashboard/body-measurements-chart.tsx
"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";

// Empty - measurement data will be fetched from API
const mockMeasurementData: Array<{ date: string; butt: number; waist: number; chest: number; arms: number; hips: number; thighs: number }> = [];

type MeasurementKey = "butt" | "waist" | "chest" | "arms" | "hips" | "thighs";

interface MeasurementConfig {
  key: MeasurementKey;
  label: string;
  color: string;
  enabled: boolean;
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function BodyMeasurementsChart() {
  const [enabledMeasurements, setEnabledMeasurements] = useState<Record<MeasurementKey, boolean>>({
    butt: true,
    waist: true,
    chest: true,
    arms: true,
    hips: true,
    thighs: true,
  });

  if (mockMeasurementData.length === 0) {
    return (
      <div className="rounded-xl border border-gray-300 bg-white p-8 text-center shadow-card dark:border-dark-border dark:bg-dark-card dark:shadow-card-dark">
        <p className="text-sm text-gray-500 dark:text-gray-400">No measurement data yet</p>
      </div>
    );
  }

  const data = mockMeasurementData.map((item) => ({
    ...item,
    date: format(new Date(item.date), "MMM d"),
  }));

  const latest = mockMeasurementData[mockMeasurementData.length - 1];
  const previous = mockMeasurementData[0];

  const measurements: MeasurementConfig[] = [
    { key: "butt", label: "Butt", color: "#6366f1", enabled: enabledMeasurements.butt },
    { key: "waist", label: "Waist", color: "#ef4444", enabled: enabledMeasurements.waist },
    { key: "chest", label: "Chest", color: "#3b82f6", enabled: enabledMeasurements.chest },
    { key: "arms", label: "Arms", color: "#10b981", enabled: enabledMeasurements.arms },
    { key: "hips", label: "Hips", color: "#f59e0b", enabled: enabledMeasurements.hips },
    { key: "thighs", label: "Thighs", color: "#8b5cf6", enabled: enabledMeasurements.thighs },
  ];

  const changes: Record<MeasurementKey, number> = {
    butt: calculatePercentageChange(latest.butt, previous.butt),
    waist: calculatePercentageChange(latest.waist, previous.waist),
    chest: calculatePercentageChange(latest.chest, previous.chest),
    arms: calculatePercentageChange(latest.arms, previous.arms),
    hips: calculatePercentageChange(latest.hips, previous.hips),
    thighs: calculatePercentageChange(latest.thighs, previous.thighs),
  };

  const toggleMeasurement = (key: MeasurementKey) => {
    setEnabledMeasurements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const enabledCount = Object.values(enabledMeasurements).filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Compact Stats Grid - Clickable to toggle */}
      <div className="grid grid-cols-3 gap-2 text-sm">
        {measurements.map((measurement) => {
          const change = changes[measurement.key];
          const isEnabled = measurement.enabled;
          
          return (
            <button
              key={measurement.key}
              onClick={() => toggleMeasurement(measurement.key)}
              className={`flex items-center justify-between rounded-xl border p-2 text-left transition-all ${
                isEnabled
                  ? "border-2 border-gray-900 bg-white dark:border-dark-text dark:bg-dark-card"
                  : "border border-gray-300 bg-white dark:border-dark-border dark:bg-dark-card"
              }`}
            >
              <span className="text-xs font-medium capitalize text-gray-900 dark:text-dark-text">
                {measurement.label}
              </span>
              <span
                className={`text-xs font-bold ${
                  change > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {change > 0 ? "+" : ""}
                {change.toFixed(1)}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Chart - Aligned with grid above */}
      {enabledCount > 0 ? (
        <div className="w-full">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart 
              data={data} 
              margin={{ left: 0, right: 10, top: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={35} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              {measurements
                .filter((m) => m.enabled)
                .map((measurement) => (
                  <Line
                    key={measurement.key}
                    type="monotone"
                    dataKey={measurement.key}
                    stroke={measurement.color}
                    strokeWidth={2}
                    name={measurement.label}
                    dot={{ r: 2.5 }}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[180px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-700/50">
          <p className="text-xs">Click boxes above to enable measurements</p>
        </div>
      )}
    </div>
  );
}
