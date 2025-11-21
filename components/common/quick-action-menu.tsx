// components/common/quick-action-menu.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BottomSheet } from "./bottom-sheet";
import { LogMenu } from "./log-menu";
import { AddToLibraryModal } from "@/components/library/add-to-library-modal";

interface QuickActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickActionMenu({ isOpen, onClose }: QuickActionMenuProps) {
  const router = useRouter();
  const [showLogMenu, setShowLogMenu] = useState(false);
  const [showAddToLibrary, setShowAddToLibrary] = useState(false);

  const actions = [
    {
      id: "library",
      label: "Add to Library",
      onClick: () => {
        setShowAddToLibrary(true);
      },
    },
    {
      id: "barcode",
      label: "Scan Barcode",
      onClick: () => {
        router.push("/library?view=barcode");
        onClose();
      },
    },
    {
      id: "quick-add",
      label: "Quick Add",
      onClick: () => {
        router.push("/library?view=quick-add");
        onClose();
      },
    },
    {
      id: "ai-suggest",
      label: "AI Suggest",
      onClick: () => {
        // TODO: Open AI suggestions
        onClose();
      },
    },
    {
      id: "log",
      label: "Log",
      onClick: () => {
        setShowLogMenu(true);
      },
    },
    {
      id: "photo",
      label: "Upload Progress Photo",
      onClick: () => {
        // TODO: Open photo upload
        alert("Photo upload coming soon!");
        onClose();
      },
    },
  ];

  // Trigger haptic feedback when opening (if available)
  if (isOpen && typeof window !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10); // Short vibration
  }

  return (
    <>
      <BottomSheet isOpen={isOpen && !showLogMenu} onClose={onClose} title="Quick Actions">
        <div className="space-y-3">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className="flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-4 text-base font-medium transition-colors hover:bg-gray-100 dark:border-dark-border dark:bg-dark-card dark:hover:bg-dark-hover dark:text-dark-text"
            >
              {action.label}
            </button>
          ))}
        </div>
      </BottomSheet>
      <LogMenu isOpen={showLogMenu} onClose={() => { setShowLogMenu(false); onClose(); }} />
      <AddToLibraryModal
        isOpen={showAddToLibrary}
        onClose={() => {
          setShowAddToLibrary(false);
          onClose();
        }}
        onSuccess={() => {
          setShowAddToLibrary(false);
          onClose();
        }}
      />
    </>
  );
}

