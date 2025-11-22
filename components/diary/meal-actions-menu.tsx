// components/diary/meal-actions-menu.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Share2 } from "lucide-react";

interface MealActionsMenuProps {
  onAIClick?: (e?: React.MouseEvent) => void;
  onAddClick?: (e?: React.MouseEvent) => void;
  onShareClick: (e?: React.MouseEvent) => void;
}

export function MealActionsMenu({ onShareClick }: MealActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="p-1">
              <button
                onClick={() => {
                  onShareClick();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Share2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                Share Meal
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

