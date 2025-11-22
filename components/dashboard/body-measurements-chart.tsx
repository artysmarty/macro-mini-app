// components/dashboard/body-measurements-chart.tsx
"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";
import { useMeasurementLogs } from "@/hooks/use-measurement-logs";
import { useAuth } from "@/contexts/auth-context";

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
  const { fid } = useAuth();
  const userId = getUserId(fid);
  const { data: measurementLogs = [], isLoading } = useMeasurementLogs(userId);
  const [enabledMeasurements, setEnabledMeasurements] = useState<Record<MeasurementKey, boolean>>({
    butt: true,
    waist: true,
    chest: true,
    arms: true,
    hips: true,
    thighs: true,
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-300 bg-white p-8 text-center shadow-card dark:border-dark-border dark:bg-dark-card dark:shadow-card-dark">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading measurement data...</p>
      </div>
    );
  }

  if (measurementLogs.length === 0) {
    return (
      <div className="rounded-xl border border-gray-300 bg-white p-8 text-center shadow-card dark:border-dark-border dark:bg-dark-card dark:shadow-card-dark">
        <p className="text-sm text-gray-500 dark:text-gray-400">No measurement data yet</p>
      </div>
    );
  }

  // Transform measurement logs into chart data format
  const data = measurementLogs.map((log) => {
    const m = log.measurements;
    
    return {
      date: format(new Date(log.date), "MMM d"),
      butt: m.butt || 0,
      waist: m.waist || 0,
      chest: m.chest || 0,
      arms: m.arms || 0,
      hips: m.hips || 0,
      thighs: m.thighs || 0,
    };
  });

  const latest = measurementLogs[measurementLogs.length - 1];
  const previous = measurementLogs[0];
  
  // Calculate changes from measurements
  const latestMeasurements = latest.measurements;
  const previousMeasurements = previous.measurements;

  const measurements: MeasurementConfig[] = [
    { key: "butt", label: "Butt", color: "#6366f1", enabled: enabledMeasurements.butt },
    { key: "waist", label: "Waist", color: "#ef4444", enabled: enabledMeasurements.waist },
    { key: "chest", label: "Chest", color: "#3b82f6", enabled: enabledMeasurements.chest },
    { key: "arms", label: "Arms", color: "#10b981", enabled: enabledMeasurements.arms },
    { key: "hips", label: "Hips", color: "#f59e0b", enabled: enabledMeasurements.hips },
    { key: "thighs", label: "Thighs", color: "#8b5cf6", enabled: enabledMeasurements.thighs },
  ];

  const changes: Record<MeasurementKey, number> = {
    butt: calculatePercentageChange(latestMeasurements.butt || 0, previousMeasurements.butt || 0),
    waist: calculatePercentageChange(latestMeasurements.waist || 0, previousMeasurements.waist || 0),
    chest: calculatePercentageChange(latestMeasurements.chest || 0, previousMeasurements.chest || 0),
    arms: calculatePercentageChange(latestMeasurements.arms || 0, previousMeasurements.arms || 0),
    hips: calculatePercentageChange(latestMeasurements.hips || 0, previousMeasurements.hips || 0),
    thighs: calculatePercentageChange(latestMeasurements.thighs || 0, previousMeasurements.thighs || 0),
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
