// components/diary/meal-section.tsx
"use client";

import { useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { DiaryEntryList } from "./diary-entry-list";
import { MealSuggestions } from "@/components/ai/meal-suggestions";
import { MealActionsMenu } from "./meal-actions-menu";
import { ShareMealModal } from "./share-meal-modal";

interface MealSectionProps {
  mealType: "breakfast" | "lunch" | "dinner" | "snacks";
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

export function MealSection({ mealType, onAddClick }: MealSectionProps) {
  const label = mealLabels[mealType];
  const [showAI, setShowAI] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Mock meal data for sharing - will be replaced with actual diary entries
  const mealEntries: any[] = []; // TODO: Get actual entries for this meal type
  const hasEntries = mealEntries.length > 0;
  const mealMacros = mockMealMacros[mealType];

  return (
    <>
      <div className="rounded-xl border border-gray-300 bg-white shadow-card dark:border-dark-border dark:bg-dark-card dark:shadow-card-dark">
        {/* Header - Clickable to toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between border-b border-gray-300 px-4 py-3 dark:border-dark-border"
        >
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
            <h3 className="font-semibold capitalize text-gray-900 dark:text-dark-text">{label}</h3>
          </div>
          <div className="flex items-center gap-3">
            <MealActionsMenu
              onAIClick={() => {
                setShowAI(!showAI);
              }}
              onAddClick={() => {
                onAddClick?.();
              }}
              onShareClick={() => {
                setShowShareModal(true);
              }}
            />
          </div>
        </button>

        {/* Body - Collapsible */}
        {isExpanded && (
          <div className="p-4">
            {showAI && (
              <div className="mb-4">
                <MealSuggestions
                  onSelectMeal={(meal) => {
                    // TODO: Add meal to diary
                    console.log("Log meal:", meal);
                    setShowAI(false);
                  }}
                />
              </div>
            )}

            {hasEntries ? (
              <DiaryEntryList mealType={mealType} />
            ) : null}

            {/* Footer - Add Button */}
            <div className="mt-4 border-t border-gray-300 pt-3 dark:border-dark-border">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddClick?.();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-white transition-colors hover:bg-primary-hover"
              >
                <Plus className="h-5 w-5" />
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
                {mealMacros.calories}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Protein</div>
              <div className="text-sm font-bold text-gray-900 dark:text-dark-text">
                {mealMacros.protein}g
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Carbs</div>
              <div className="text-sm font-bold text-gray-900 dark:text-dark-text">
                {mealMacros.carbs}g
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Fat</div>
              <div className="text-sm font-bold text-gray-900 dark:text-dark-text">
                {mealMacros.fat}g
              </div>
            </div>
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareMealModal
          mealType={mealType}
          entries={mealEntries}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
}

