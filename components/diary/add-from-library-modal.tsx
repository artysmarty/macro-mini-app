// components/diary/add-from-library-modal.tsx
"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { FoodDetailSheet } from "@/components/library/food-detail-sheet";
import type { FoodItem } from "@/types";

interface AddFromLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: "breakfast" | "lunch" | "dinner" | "snacks" | null;
  onAdd: (food: FoodItem, quantity?: number) => void;
}

// Empty - foods will be fetched from API
const mockFoods: FoodItem[] = [];

export function AddFromLibraryModal({ isOpen, onClose, mealType, onAdd }: AddFromLibraryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [showLogSheet, setShowLogSheet] = useState(false);

  if (!isOpen) return null;

  const filteredFoods = mockFoods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = (food: FoodItem) => {
    // Instead of directly adding, show the Log sheet
    setSelectedFood(food);
    setShowLogSheet(true);
  };
  
  const handleLogMealSelect = (food: FoodItem, mealType: "breakfast" | "lunch" | "dinner" | "snacks", quantity?: number) => {
    onAdd(food, quantity);
    setShowLogSheet(false);
    setSelectedFood(null);
    onClose();
  };
  
  const handleQuickAdd = (food: FoodItem, quantity?: number) => {
    // For Quick Add (now "Log"), use the mealType from props
    // The mealType is set when the user clicks "Add" in a specific meal section
    console.log("handleQuickAdd called:", { food: food.name, quantity, mealType });
    if (mealType) {
      // Pass mealType and quantity to ensure it's used
      onAdd(food, quantity);
      setShowLogSheet(false);
      setSelectedFood(null);
      onClose();
    } else {
      // If no mealType is set, alert the user
      alert("Please select a meal section first (Breakfast, Lunch, Dinner, or Snacks).");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-dark-card max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Add from Library</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-gray-300 px-4 py-3 dark:border-dark-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search foods..."
              className="h-12 w-full rounded-xl border border-gray-300 bg-gray-100 px-10 text-sm focus:border-primary focus:bg-white focus:outline-none dark:border-dark-border dark:bg-dark-hover dark:text-dark-text"
            />
          </div>
        </div>

        {/* Food List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredFoods.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              No foods found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between rounded-xl border border-gray-300 bg-white p-4 dark:border-dark-border dark:bg-dark-card"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-dark-text">{food.name}</h3>
                    {food.brand && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">{food.brand}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {food.servingSize} · {food.calories} cal
                    </p>
                  </div>
                  <button
                    onClick={() => handleAdd(food)}
                    className="ml-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                  >
                    Log
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Food Detail Sheet - Shows after clicking Log */}
      {selectedFood && showLogSheet && (
        <FoodDetailSheet
          isOpen={showLogSheet}
          onClose={() => {
            setShowLogSheet(false);
            setSelectedFood(null);
          }}
          foodItem={selectedFood}
          onAddToMeal={(mealType, quantity) => {
            if (mealType) {
              handleLogMealSelect(selectedFood, mealType, quantity);
            }
          }}
          onQuickAdd={(quantity) => {
            handleQuickAdd(selectedFood, quantity);
          }}
        />
      )}
    </div>
  );
}

