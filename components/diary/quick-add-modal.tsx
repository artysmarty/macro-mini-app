// components/diary/quick-add-modal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { FoodItem } from "@/types";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: "breakfast" | "lunch" | "dinner" | "snacks" | null;
  onAdd: (food: FoodItem) => void;
}

export function QuickAddModal({ isOpen, onClose, mealType, onAdd }: QuickAddModalProps) {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!foodName.trim() || !calories) {
      alert("Please enter at least food name and calories");
      return;
    }

    const food: FoodItem = {
      id: `quick-${Date.now()}`,
      name: foodName.trim(),
      servingSize: "1 serving",
      calories: parseFloat(calories) || 0,
      proteinG: parseFloat(protein) || 0,
      carbsG: parseFloat(carbs) || 0,
      fatsG: parseFloat(fat) || 0,
      isPublic: false,
      category: "foods", // Ensure category is set
    };

    onAdd(food);
    
    // Reset form
    setFoodName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
  };

  // Auto-calculate calories if not provided: 4 cal/g protein + 4 cal/g carbs + 9 cal/g fat
  const calculatedCalories = calories || (
    (parseFloat(protein) || 0) * 4 + 
    (parseFloat(carbs) || 0) * 4 + 
    (parseFloat(fat) || 0) * 9
  ).toString();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-dark-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Quick Add</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Food Name
            </label>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g., Grilled Chicken"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary focus:outline-none dark:border-dark-border dark:bg-dark-hover dark:text-dark-text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Calories
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder={calculatedCalories || "0"}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary focus:outline-none dark:border-dark-border dark:bg-dark-hover dark:text-dark-text"
            />
            {!calories && (parseFloat(protein) || parseFloat(carbs) || parseFloat(fat)) && (
              <p className="text-xs text-gray-500 mt-1">
                Calculated: {Math.round(parseFloat(calculatedCalories))} cal
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Protein (g)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary focus:outline-none dark:border-dark-border dark:bg-dark-hover dark:text-dark-text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Carbs (g)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary focus:outline-none dark:border-dark-border dark:bg-dark-hover dark:text-dark-text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fat (g)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary focus:outline-none dark:border-dark-border dark:bg-dark-hover dark:text-dark-text"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Add to {mealType ? mealType.charAt(0).toUpperCase() + mealType.slice(1) : "Diary"}
          </button>
        </div>
      </div>
    </div>
  );
}

