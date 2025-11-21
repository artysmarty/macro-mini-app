// components/dashboard/progress-analytics.tsx
"use client";

import { useState } from "react";
import { ProgressChart } from "./progress-chart";
import { BodyMeasurementsChart } from "./body-measurements-chart";

type AnalyticsTab = "weight" | "measurements";

export function ProgressAnalytics() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("weight");

  const tabs: { id: AnalyticsTab; label: string }[] = [
    { id: "weight", label: "Weight" },
    { id: "measurements", label: "Measurements" },
  ];

  return (
    <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-card dark:border-dark-border dark:bg-dark-card dark:shadow-card-dark">
      <div className="mb-4 flex gap-2 border-b border-gray-300 dark:border-dark-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 border-b-2 pb-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 dark:text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[200px]">
        {activeTab === "weight" && <ProgressChart />}
        {activeTab === "measurements" && <BodyMeasurementsChart />}
      </div>
    </div>
  );
}

