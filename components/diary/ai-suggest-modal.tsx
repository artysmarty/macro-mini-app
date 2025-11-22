// components/diary/ai-suggest-modal.tsx
"use client";

import { useState } from "react";
import { X, Sparkles, ChefHat, Check } from "lucide-react";
import { MealSuggestions } from "@/components/ai/meal-suggestions";
import type { FoodItem } from "@/types";

interface MealSuggestion {
  name: string;
  ingredients: string[];
  instructions: string;
  portionSize: string;
  macros: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatsG: number;
  };
}

interface AISuggestModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: "breakfast" | "lunch" | "dinner" | "snacks" | null;
  onAdd: (meals: FoodItem[]) => void;
}

export function AISuggestModal({ isOpen, onClose, mealType, onAdd }: AISuggestModalProps) {
  const [approvedMeals, setApprovedMeals] = useState<MealSuggestion[]>([]);

  if (!isOpen) return null;

  const handleSelectMeal = (meal: MealSuggestion) => {
    setApprovedMeals((prev) => [...prev, meal]);
  };

  const handleMarkDone = () => {
    // Convert approved meals to FoodItem format and add to diary
    // Include instructions as a custom property so it can be passed through
    const foodItems: (FoodItem & { instructions?: string })[] = approvedMeals.map((meal, index) => ({
      id: `ai-meal-${Date.now()}-${index}`,
      name: meal.name,
      servingSize: meal.portionSize,
      calories: meal.macros.calories,
      proteinG: meal.macros.proteinG,
      carbsG: meal.macros.carbsG,
      fatsG: meal.macros.fatsG,
      isPublic: false,
      category: "meals",
      instructions: meal.instructions, // Store instructions for copying to notes
    }));

    onAdd(foodItems);
    setApprovedMeals([]);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-dark-card max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">AI Meal Suggestions</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <MealSuggestions onSelectMeal={handleSelectMeal} />

          {approvedMeals.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-dark-text">
                Approved Meals ({approvedMeals.length})
              </h3>
              {approvedMeals.map((meal, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="font-semibold text-gray-900 dark:text-dark-text">{meal.name}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {meal.macros.calories} cal · {meal.macros.proteinG}g P · {meal.macros.carbsG}g C · {meal.macros.fatsG}g F
                      </p>
                    </div>
                    <button
                      onClick={() => setApprovedMeals((prev) => prev.filter((_, i) => i !== index))}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {approvedMeals.length > 0 && (
          <div className="border-t border-gray-300 p-4 dark:border-dark-border">
            <button
              onClick={handleMarkDone}
              className="w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition-colors hover:bg-green-700"
            >
              Done - Add {approvedMeals.length} meal{approvedMeals.length > 1 ? "s" : ""} to {mealType ? mealType.charAt(0).toUpperCase() + mealType.slice(1) : "Diary"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

