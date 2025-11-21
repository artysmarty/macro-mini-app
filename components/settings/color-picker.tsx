// components/settings/color-picker.tsx
"use client";

import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";

export function ColorPicker() {
  const { theme, setTheme } = useTheme();
  const [customColor, setCustomColor] = useState("#3b82f6");

  // Get current theme's color or use custom
  const getCurrentColor = () => {
    if (theme === "light" || theme === "dark") {
      return customColor;
    }
    // Map theme to colors
    const themeColors: Record<string, string> = {
      blue: "#3b82f6",
      green: "#10b981",
      purple: "#8b5cf6",
      orange: "#f59e0b",
    };
    return themeColors[theme] || customColor;
  };

  const handleColorChange = (color: string) => {
    setCustomColor(color);
    // Apply custom color immediately
    const root = document.documentElement;
    root.style.setProperty("--primary", color);
    
    // Calculate hover color (slightly darker)
    const rgb = hexToRgb(color);
    if (rgb) {
      const hoverColor = `rgb(${Math.max(0, rgb.r - 20)}, ${Math.max(0, rgb.g - 20)}, ${Math.max(0, rgb.b - 20)})`;
      root.style.setProperty("--primary-hover", hoverColor);
    }
    
    localStorage.setItem("custom-primary-color", color);
  };

  function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold">App Color</h3>
      
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Primary Color</label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={getCurrentColor()}
              onChange={(e) => handleColorChange(e.target.value)}
              className="h-12 w-24 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              value={getCurrentColor()}
              onChange={(e) => {
                if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                  handleColorChange(e.target.value);
                }
              }}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm dark:border-gray-600 dark:bg-gray-700"
              placeholder="#3b82f6"
            />
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
          <div className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
            Preview
          </div>
          <div className="flex gap-2">
            <div
              className="flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium text-white"
              style={{ backgroundColor: getCurrentColor() }}
            >
              Button
            </div>
            <div
              className="flex-1 rounded-lg border-2 px-4 py-2 text-center text-sm font-medium"
              style={{
                borderColor: getCurrentColor(),
                color: getCurrentColor(),
              }}
            >
              Outline
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

