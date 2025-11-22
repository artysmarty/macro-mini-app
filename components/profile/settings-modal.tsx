// components/profile/settings-modal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ThemeSelector } from "@/components/settings/theme-selector";
import { HealthIntegrations } from "@/components/settings/health-integrations";
import { AddMiniAppButton } from "@/components/common/add-miniapp-button";
import { EditMacrosModal } from "@/components/settings/edit-macros-modal";

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [showEditMacros, setShowEditMacros] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Settings</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[80vh] space-y-4 overflow-y-auto p-4">
            <div className="rounded-xl border border-gray-300 bg-white p-4 dark:border-dark-border dark:bg-dark-card">
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-dark-text">
                Macros
              </h3>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                Edit your daily macro targets (calories, protein, carbs, fats).
              </p>
              <button
                onClick={() => setShowEditMacros(true)}
                className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                Edit Macros
              </button>
            </div>
            <div className="rounded-xl border border-gray-300 bg-white p-4 dark:border-dark-border dark:bg-dark-card">
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-dark-text">
                Mini App
              </h3>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                Add Macro Tracker to your saved apps for quick access and enable notifications.
              </p>
              <AddMiniAppButton />
            </div>
            <ThemeSelector />
            <HealthIntegrations />
          </div>
        </div>
      </div>
      {showEditMacros && (
        <EditMacrosModal isOpen={showEditMacros} onClose={() => setShowEditMacros(false)} />
      )}
    </>
  );
}

