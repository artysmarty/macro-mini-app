// components/profile/miniapp-card.tsx
"use client";

import { Plus } from "lucide-react";
import { AddMiniAppButton } from "@/components/common/add-miniapp-button";

export function MiniAppCard() {
  return (
    <div className="rounded-xl border border-gray-300 bg-gradient-to-br from-primary/10 to-primary/5 p-4 dark:border-dark-border dark:bg-dark-card">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
          <Plus className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-dark-text">
            Save Mini App
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Quick access & notifications
          </p>
        </div>
      </div>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        Add Macro Tracker to your saved apps for quick access and enable notifications to stay updated on your fitness journey.
      </p>
      <AddMiniAppButton variant="button" className="w-full" />
    </div>
  );
}

