// components/common/add-bottom-sheet.tsx
"use client";

import { useRouter } from "next/navigation";
import { BookOpen, Scan, FileText, Sparkles } from "lucide-react";
import { BottomSheet } from "./bottom-sheet";

interface AddBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBottomSheet({ isOpen, onClose }: AddBottomSheetProps) {
  const router = useRouter();

  const actions = [
    {
      id: "library",
      label: "Add from Library",
      icon: BookOpen,
      color: "bg-primary",
      onClick: () => {
        router.push("/library");
        onClose();
      },
    },
    {
      id: "barcode",
      label: "Scan Barcode",
      icon: Scan,
      color: "bg-success",
      onClick: () => {
        router.push("/library?view=barcode");
        onClose();
      },
    },
    {
      id: "quick-add",
      label: "Quick Add",
      icon: FileText,
      color: "bg-warning",
      onClick: () => {
        router.push("/library?view=quick-add");
        onClose();
      },
    },
    {
      id: "ai-suggest",
      label: "AI Suggest",
      icon: Sparkles,
      color: "bg-info",
      onClick: () => {
        // TODO: Open AI suggestions
        onClose();
      },
    },
  ];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Add Food">
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className="flex w-full items-center gap-4 rounded-xl border border-gray-300 bg-white p-4 text-left transition-colors hover:bg-gray-100 dark:border-dark-border dark:bg-dark-card dark:hover:bg-dark-hover"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color} text-white`}>
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-base font-medium text-gray-900 dark:text-dark-text">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}

