// components/library/food-library-screen.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, Share2 } from "lucide-react";
import { AppBar } from "@/components/layout/app-bar";
import { FoodDetailSheet } from "./food-detail-sheet";
import { ShareFood } from "@/components/sharing/share-food";
import type { FoodItem } from "@/types";

type CategoryFilter = "all" | "foods" | "recipes";

// Empty - foods will be fetched from API
const mockFoods: FoodItem[] = [];

interface FoodLibraryScreenProps {
  onAddToMeal?: (foodItem: FoodItem, mealType: "breakfast" | "lunch" | "dinner" | "snacks", quantity?: number) => void;
  onQuickAdd?: (foodItem: FoodItem) => void;
}

export function FoodLibraryScreen({ onAddToMeal, onQuickAdd }: FoodLibraryScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [showLogSheet, setShowLogSheet] = useState(false);
  const [foods] = useState<FoodItem[]>(mockFoods);

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    // TODO: Filter by category when meals/recipes are added
    return matchesSearch;
  });

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "foods", label: "Foods" },
    { id: "recipes", label: "Recipes" },
  ];

  const handleFoodClick = (food: FoodItem) => {
    setSelectedFood(food);
  };

  const handleAdd = (e: React.MouseEvent, food: FoodItem) => {
    e.stopPropagation();
    // Directly add to diary - no initial popup
    // This will be handled by the Diary page's Add From Library modal
    if (onAddToMeal) {
      // If called from Diary, it will handle the meal selection
      // For now, just trigger the Log screen
      setSelectedFood(food);
      setShowLogSheet(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col pb-24">
      <AppBar title="Food Library" rightAction="share" />
      
      {/* Search Bar */}
      <div className="border-b border-gray-300 bg-white px-4 py-3 dark:border-dark-border dark:bg-dark-bg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search foods, recipes…"
            className="h-[50px] w-full rounded-xl border-0 bg-gray-100 px-10 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-card dark:text-dark-text dark:focus:bg-dark-hover"
            style={{ borderRadius: "12px" }}
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="border-b border-gray-300 bg-white px-4 py-3 dark:border-dark-border dark:bg-dark-bg">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`h-10 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-dark-hover dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Item List */}
      <main className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-4">
          {filteredFoods.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              No foods found
            </div>
          ) : (
            filteredFoods.map((food) => (
              <div
                key={food.id}
                onClick={() => handleFoodClick(food)}
                className="flex h-20 cursor-pointer items-center justify-between rounded-xl border border-gray-300 bg-white px-4 transition-colors hover:bg-gray-50 dark:border-dark-border dark:bg-dark-card dark:hover:bg-dark-hover"
              >
                {/* Left: Food Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-dark-text">
                    {food.name}
                  </h3>
                  {food.brand && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">{food.brand}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {food.servingSize} · {food.calories} cal
                  </p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                  <ShareFood
                    foodItem={{
                      id: food.id,
                      name: food.name,
                      type: "food",
                      brand: food.brand,
                      servingSize: food.servingSize,
                      calories: food.calories,
                    }}
                    variant="icon"
                  />
                  <button
                    onClick={(e) => handleAdd(e, food)}
                    className="h-10 w-[70px] rounded-lg bg-primary px-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Food Detail Sheet - Only shown after clicking "Log" */}
      {selectedFood && showLogSheet && (
        <FoodDetailSheet
          isOpen={showLogSheet}
          onClose={() => {
            setShowLogSheet(false);
            setSelectedFood(null);
          }}
          foodItem={selectedFood}
          onAddToMeal={(mealType, quantity) => {
            onAddToMeal?.(selectedFood, mealType, quantity);
            setShowLogSheet(false);
            setSelectedFood(null);
          }}
          onQuickAdd={(quantity) => {
            onQuickAdd?.(selectedFood);
            setShowLogSheet(false);
            setSelectedFood(null);
          }}
        />
      )}
    </div>
  );
}

