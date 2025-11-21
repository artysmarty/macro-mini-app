// components/dashboard/customizable-dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { GripVertical, BarChart3 } from "lucide-react";
import { MacroStatusCard } from "./macro-status-card";
import { StreakCalendar } from "./streak-calendar";
import { ProgressChart } from "./progress-chart";
import { PhotoTimeline } from "./photo-timeline";
import { BodyMeasurementsChart } from "./body-measurements-chart";
import { cn } from "@/lib/utils";

export type DashboardWidget = "macros" | "streaks" | "analytics" | "timeline";

interface DashboardWidgetConfig {
  id: DashboardWidget;
  label: string;
  component: React.ComponentType;
}

const widgetConfigs: DashboardWidgetConfig[] = [
  { id: "macros", label: "Today's Macros", component: MacroStatusCard },
  { id: "streaks", label: "Streaks", component: StreakCalendar },
  { id: "analytics", label: "Progress Analytics", component: ProgressChart },
  { id: "timeline", label: "Photo Timeline", component: PhotoTimeline },
];

export function CustomizableDashboard() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboard-widget-order");
      if (saved) return JSON.parse(saved);
    }
    return ["macros", "streaks", "analytics", "timeline"];
  });

  const [analyticsType, setAnalyticsType] = useState<"weight" | "measurements">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboard-analytics-type");
      if (saved) return saved as "weight" | "measurements";
    }
    return "weight";
  });

  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("dashboard-widget-order", JSON.stringify(widgets));
  }, [widgets]);

  useEffect(() => {
    localStorage.setItem("dashboard-analytics-type", analyticsType);
  }, [analyticsType]);

  const handleDragStart = (index: number) => {
    setIsDragging(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOver(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (isDragging === null) return;

    const newWidgets = [...widgets];
    const draggedWidget = newWidgets[isDragging];
    newWidgets.splice(isDragging, 1);
    newWidgets.splice(dropIndex, 0, draggedWidget);

    setWidgets(newWidgets);
    setIsDragging(null);
    setDragOver(null);
  };

  const handleDragEnd = () => {
    setIsDragging(null);
    setDragOver(null);
  };

  const renderWidget = (widgetId: DashboardWidget) => {
    const config = widgetConfigs.find((w) => w.id === widgetId);
    if (!config) return null;

    const Component = config.component;

    if (widgetId === "analytics") {
      return (
        <div key={widgetId} className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Progress Analytics</h2>
            <div className="flex gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
              <button
                onClick={() => setAnalyticsType("weight")}
                className={cn(
                  "rounded px-3 py-1 text-sm font-medium transition-colors",
                  analyticsType === "weight"
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white"
                    : "text-gray-600 dark:text-gray-400"
                )}
              >
                Weight
              </button>
              <button
                onClick={() => setAnalyticsType("measurements")}
                className={cn(
                  "rounded px-3 py-1 text-sm font-medium transition-colors",
                  analyticsType === "measurements"
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white"
                    : "text-gray-600 dark:text-gray-400"
                )}
              >
                Measurements
              </button>
            </div>
          </div>
          {analyticsType === "weight" ? <ProgressChart /> : <BodyMeasurementsChart />}
        </div>
      );
    }

    return <Component key={widgetId} />;
  };

  return (
    <div className="space-y-6">
      {widgets.map((widgetId, index) => {
        const config = widgetConfigs.find((w) => w.id === widgetId);
        const isDraggingThis = isDragging === index;

        return (
          <div
            key={`${widgetId}-${index}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              "group relative rounded-lg border border-gray-200 bg-white transition-all dark:border-gray-700 dark:bg-gray-800",
              isDraggingThis && "opacity-50",
              dragOver === index && "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
            )}
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-2 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 cursor-move text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {config?.label}
                </span>
              </div>
            </div>
            <div className="p-4">{renderWidget(widgetId)}</div>
          </div>
        );
      })}
    </div>
  );
}

