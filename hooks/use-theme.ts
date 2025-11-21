// hooks/use-theme.ts
"use client";

import { useState, useEffect } from "react";

export type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("app-theme");
      if (saved) return saved as Theme;
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-dark", "theme-blue", "theme-green", "theme-purple", "theme-orange");
    root.classList.add(`theme-${theme}`);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  return { theme, setTheme };
}

