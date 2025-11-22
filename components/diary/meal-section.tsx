// components/diary/meal-section.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DiaryEntryList } from "./diary-entry-list";
import { MealActionsMenu } from "./meal-actions-menu";
import { ShareMealModal } from "./share-meal-modal";
import { useDiaryEntries } from "@/hooks/use-diary-entries";
import { useMacroLog } from "@/hooks/use-macro-log";
import { useAuth } from "@/contexts/auth-context";
import type { DiaryEntry } from "@/types";

interface MealSectionProps {
  mealType: "breakfast" | "lunch" | "dinner" | "snacks";
  selectedDate?: Date;
  onAddClick?: () => void;
}

const mealLabels: Record<MealSectionProps["mealType"], string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snacks: "Snacks",
};

// Mock meal macros - will be replaced with actual API data
const mockMealMacros: Record<MealSectionProps["mealType"], { calories: number; protein: number; carbs: number; fat: number }> = {
  breakfast: { calories: 420, protein: 25, carbs: 45, fat: 12 },
  lunch: { calories: 580, protein: 35, carbs: 60, fat: 18 },
  dinner: { calories: 650, protein: 40, carbs: 55, fat: 22 },
  snacks: { calories: 180, protein: 8, carbs: 20, fat: 6 },
};

export function MealSection({ mealType, selectedDate = new Date(), onAddClick }: MealSectionProps) {
  const { fid } = useAuth();
  const label = mealLabels[mealType];
  const [showShareModal, setShowShareModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  
  const date = format(selectedDate, "yyyy-MM-dd");
  
  // Use consistent userId - match the logic from DiaryPage
  const getUserId = () => {
    if (fid) {
      return `fid-${fid}`;
    }
    // Use the same dev userId from localStorage (same as DiaryPage)
    if (typeof window !== 'undefined') {
      const devUserId = localStorage.getItem('devUserId');
      return devUserId || "";
    }
    return "";
  };
  
  const userId = getUserId();
  const { data: entries = [], isLoading, error } = useDiaryEntries(userId, date, mealType);
  const { data: macroLog } = useMacroLog(date, userId);
  
  console.log("MealSection:", {
    mealType,
    date,
    userId,
    entriesCount: entries.length,
    entries: entries.map(e => ({ id: e.id, type: e.type, foodItemId: e.foodItemId, mealType: e.mealType })),
    isLoading,
    error
  });
  
  // Also log the API call being made
  console.log("Fetching diary entries with params:", {
    userId,
    date,
    mealType,
    url: `/api/diary-entries?userId=${encodeURIComponent(userId)}&date=${date}&mealType=${mealType}`
  });
  
  // If there's an error, log it but continue rendering
  if (error) {
    console.error("Error fetching diary entries:", error);
  }
  
  const hasEntries = entries.length > 0;
  
  // Calculate meal macros from entries
  // Entries are enriched with foodItem data from the API
  const mealMacros = (entries as any[]).reduce(
    (acc, entry: DiaryEntry & { foodItem?: any }) => {
      if (entry.type === "quick") {
        acc.calories += (entry.quickCalories || 0) * (entry.quantity || 1);
        acc.protein += (entry.quickProteinG || 0) * (entry.quantity || 1);
        acc.carbs += (entry.quickCarbsG || 0) * (entry.quantity || 1);
        acc.fat += (entry.quickFatsG || 0) * (entry.quantity || 1);
      } else if (entry.foodItemId && (entry as any).foodItem) {
        // Use food item data from enriched entry
        const foodItem = (entry as any).foodItem;
        const quantity = entry.quantity || 1;
        acc.calories += (foodItem.calories || 0) * quantity;
        acc.protein += (foodItem.proteinG || 0) * quantity;
        acc.carbs += (foodItem.carbsG || 0) * quantity;
        acc.fat += (foodItem.fatsG || 0) * quantity;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
  
  // Always use calculated macros (show 0 if no entries)
  const displayMacros = mealMacros;

  return (
    <>
      <div className="rounded-xl border border-gray-300 bg-white shadow-card dark:border-dark-border dark:bg-dark-card dark:shadow-card-dark">
        {/* Header - Clickable to toggle */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between border-b border-gray-300 px-4 py-3 cursor-pointer dark:border-dark-border"
        >
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
            <h3 className="font-semibold capitalize text-gray-900 dark:text-dark-text">{label}</h3>
          </div>
          <div 
            className="flex items-center gap-3"
            onClick={(e) => e.stopPropagation()} // Prevent header toggle when clicking menu
          >
            <MealActionsMenu
              onShareClick={() => {
                setShowShareModal(true);
              }}
            />
          </div>
        </div>

        {/* Body - Collapsible */}
        {isExpanded && (
          <div className="p-4">
            {hasEntries && userId ? (
              <DiaryEntryList mealType={mealType} selectedDate={selectedDate} />
            ) : null}

            {/* Footer - Add Button - Always visible */}
            <div className="mt-4 border-t border-gray-300 pt-3 dark:border-dark-border">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddClick?.();
                }}
                className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-medium text-white transition-colors hover:bg-primary-hover"
              >
                <span>Add</span>
              </button>
            </div>
          </div>
        )}

        {/* Macro Summary Box - Always visible */}
        <div className="border-t border-gray-300 bg-gray-50 px-4 py-3 dark:border-dark-border dark:bg-dark-hover">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Cal</div>
              <div className="text-sm font-bold text-gray-900 dark:text-dark-text">
                {Math.round(displayMacros.calories)}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Protein</div>
              <div className="text-sm font-bold text-gray-900 dark:text-dark-text">
                {Math.round(displayMacros.protein)}g
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Carbs</div>
              <div className="text-sm font-bold text-gray-900 dark:text-dark-text">
                {Math.round(displayMacros.carbs)}g
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Fat</div>
              <div className="text-sm font-bold text-gray-900 dark:text-dark-text">
                {Math.round(displayMacros.fat)}g
              </div>
            </div>
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareMealModal
          mealType={mealType}
          entries={entries}
          onClose={() => setShowShareModal(false)}
          date={selectedDate}
        />
      )}
    </>
  );
}

