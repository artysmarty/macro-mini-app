// components/library/food-detail-sheet.tsx
"use client";

import { useState } from "react";
import { X, Share2 } from "lucide-react";
import { BottomSheet } from "@/components/common/bottom-sheet";
import type { FoodItem } from "@/types";

interface FoodDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  foodItem: FoodItem | null;
  onAddToMeal?: (mealType: "breakfast" | "lunch" | "dinner" | "snacks") => void;
  onQuickAdd?: () => void;
}

export function FoodDetailSheet({
  isOpen,
  onClose,
  foodItem,
  onAddToMeal,
  onQuickAdd,
}: FoodDetailSheetProps) {
  const [servingSize, setServingSize] = useState(1);
  const [showMealPicker, setShowMealPicker] = useState(false);

  if (!foodItem) return null;

  const mealTypes: { value: "breakfast" | "lunch" | "dinner" | "snacks"; label: string }[] = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "snacks", label: "Snack" },
  ];

  const adjustedCalories = Math.round((foodItem.calories || 0) * servingSize);
  const adjustedProtein = Math.round((foodItem.proteinG || 0) * servingSize);
  const adjustedCarbs = Math.round((foodItem.carbsG || 0) * servingSize);
  const adjustedFats = Math.round((foodItem.fatsG || 0) * servingSize);

  const handleLog = () => {
    if (showMealPicker) return;
    setShowMealPicker(true);
  };

  const handleMealSelect = (mealType: "breakfast" | "lunch" | "dinner" | "snacks") => {
    onAddToMeal?.(mealType);
    setShowMealPicker(false);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">{foodItem.name}</h2>
          {foodItem.brand && (
            <div className="mt-1 inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-dark-hover dark:text-gray-400">
              {foodItem.brand}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover">
            <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Macros */}
        <div className="rounded-xl border border-gray-300 bg-white p-4 dark:border-dark-border dark:bg-dark-card">
          <div className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Calories</div>
          <div className="mb-4 text-3xl font-bold text-gray-900 dark:text-dark-text">
            {adjustedCalories} <span className="text-lg text-gray-500">kcal</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Protein</div>
              <div className="text-lg font-semibold text-primary">{adjustedProtein}g</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Carbs</div>
              <div className="text-lg font-semibold text-info">{adjustedCarbs}g</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Fat</div>
              <div className="text-lg font-semibold text-warning">{adjustedFats}g</div>
            </div>
          </div>
        </div>

        {/* Serving Selector */}
        <div className="rounded-xl border border-gray-300 bg-white p-4 dark:border-dark-border dark:bg-dark-card">
          <div className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Serving Size</div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setServingSize(Math.max(0.25, servingSize - 0.25))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 font-medium hover:bg-gray-100 dark:border-dark-border dark:hover:bg-dark-hover"
            >
              −
            </button>
            <div className="flex-1 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                {servingSize}x
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {foodItem.servingSize}
              </div>
            </div>
            <button
              onClick={() => setServingSize(Math.min(10, servingSize + 0.25))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 font-medium hover:bg-gray-100 dark:border-dark-border dark:hover:bg-dark-hover"
            >
              +
            </button>
          </div>
        </div>

        {/* Meal Picker */}
        {showMealPicker ? (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Add to meal:</div>
            <div className="grid grid-cols-2 gap-2">
              {mealTypes.map((meal) => (
                <button
                  key={meal.value}
                  onClick={() => handleMealSelect(meal.value)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-left font-medium transition-colors hover:bg-gray-50 dark:border-dark-border dark:bg-dark-card dark:hover:bg-dark-hover"
                >
                  {meal.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                onQuickAdd?.();
                setShowMealPicker(false);
                onClose();
              }}
              className="w-full rounded-lg border border-primary bg-transparent px-4 py-3 font-medium text-primary transition-colors hover:bg-primary/10"
            >
              Quick Add
            </button>
            <button
              onClick={() => setShowMealPicker(false)}
              className="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-dark-hover dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleLog}
            className="w-full rounded-lg bg-primary px-4 py-4 text-base font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Log
          </button>
        )}
      </div>
    </BottomSheet>
  );
}

