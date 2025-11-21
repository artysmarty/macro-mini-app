// components/layout/app-bar.tsx
"use client";

import { ReactNode } from "react";
import { Share2, Settings, MoreVertical } from "lucide-react";

interface AppBarProps {
  title: string | ReactNode;
  rightAction?: "share" | "settings" | "overflow" | ReactNode;
  onRightActionClick?: () => void;
}

export function AppBar({ title, rightAction = "overflow", onRightActionClick }: AppBarProps) {
  const renderRightAction = () => {
    if (typeof rightAction !== "string") {
      return rightAction;
    }

    switch (rightAction) {
      case "share":
        return (
          <button
            onClick={onRightActionClick}
            className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover"
          >
            <Share2 className="h-5 w-5" />
          </button>
        );
      case "settings":
        return (
          <button
            onClick={onRightActionClick}
            className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover"
          >
            <Settings className="h-5 w-5" />
          </button>
        );
      case "overflow":
        return (
          <button
            onClick={onRightActionClick}
            className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-300 bg-white px-4 py-3 dark:border-dark-border dark:bg-dark-bg">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-dark-text">{title}</h1>
      {renderRightAction()}
    </header>
  );
}

