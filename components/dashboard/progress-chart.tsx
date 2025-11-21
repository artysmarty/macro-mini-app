// components/dashboard/progress-chart.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

// Mock data - will be replaced with actual API data
const mockWeightData = [
  { date: "2024-01-01", weight: 75 },
  { date: "2024-01-08", weight: 74.5 },
  { date: "2024-01-15", weight: 74 },
  { date: "2024-01-22", weight: 73.5 },
  { date: "2024-01-29", weight: 73 },
];

export function ProgressChart() {
  const data = mockWeightData.map((item) => ({
    ...item,
    date: format(new Date(item.date), "MMM d"),
  }));

  const latest = mockWeightData[mockWeightData.length - 1];
  const previous = mockWeightData[0];
  const change = latest.weight - previous.weight;
  const changePercent = ((change / previous.weight) * 100).toFixed(1);

  return (
    <div className="space-y-3">
      {/* Change indicator */}
      <div className="flex items-center justify-end">
        <div className="text-right">
          <div className="text-xs text-gray-500 dark:text-gray-400">Change</div>
          <div
            className={`text-base font-bold ${
              change < 0 ? "text-success" : "text-error"
            }`}
          >
            {change > 0 ? "+" : ""}
            {change.toFixed(1)} kg ({changePercent}%)
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <ResponsiveContainer width="100%" height={180}>
        <LineChart 
          data={data}
          margin={{ left: 0, right: 10, top: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#D9DEE7" strokeOpacity={0.3} className="dark:stroke-gray-700" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11, fill: "#636B78" }} 
            className="dark:fill-gray-400"
          />
          <YAxis 
            tick={{ fontSize: 11, fill: "#636B78" }} 
            width={35}
            className="dark:fill-gray-400"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "white", 
              border: "1px solid #D9DEE7",
              borderRadius: "8px"
            }}
            className="dark:bg-dark-card dark:border-dark-border"
          />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#3A7BFF" 
            strokeWidth={2} 
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

