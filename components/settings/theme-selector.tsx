// components/settings/theme-selector.tsx
"use client";

import { useTheme, type Theme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const themes: { value: Theme; label: string; color: string }[] = [
  { value: "light", label: "Light", color: "bg-gray-100" },
  { value: "dark", label: "Dark", color: "bg-gray-800" },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold">Appearance</h3>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all",
                theme === t.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
              )}
            >
              <div className={cn("h-8 w-8 rounded-full", t.color)} />
              <span className="text-sm font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

