// components/library/food-search.tsx
"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Share2 } from "lucide-react";
import type { FoodItem } from "@/types";
import { ShareFood } from "@/components/sharing/share-food";

interface FoodSearchProps {
  query: string;
}

// Mock data - will be replaced with actual API
const mockFoods: FoodItem[] = [
  {
    id: "1",
    name: "Chicken Breast",
    brand: "Generic",
    servingSize: "100g",
    calories: 165,
    proteinG: 31,
    carbsG: 0,
    fatsG: 3.6,
    isPublic: true,
  },
  {
    id: "2",
    name: "Brown Rice",
    brand: "Generic",
    servingSize: "100g cooked",
    calories: 111,
    proteinG: 2.6,
    carbsG: 23,
    fatsG: 0.9,
    isPublic: true,
  },
  {
    id: "3",
    name: "Broccoli",
    brand: "Generic",
    servingSize: "100g",
    calories: 34,
    proteinG: 2.8,
    carbsG: 7,
    fatsG: 0.4,
    isPublic: true,
  },
];

export function FoodSearch({ query }: FoodSearchProps) {
  const { address } = useAccount();
  const [foods, setFoods] = useState<FoodItem[]>(mockFoods);
  const [selectedType, setSelectedType] = useState<"all" | "foods" | "meals" | "recipes">("all");

  useEffect(() => {
    // TODO: Fetch from API based on query
    if (query.trim()) {
      const filtered = mockFoods.filter((food) =>
        food.name.toLowerCase().includes(query.toLowerCase())
      );
      setFoods(filtered);
    } else {
      setFoods(mockFoods);
    }
  }, [query]);

  const handleAddToDiary = (food: FoodItem) => {
    // TODO: Add to today's diary
    console.log("Add to diary:", food);
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {(["all", "foods", "meals", "recipes"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedType === type
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Food List */}
      <div className="space-y-2">
        {foods.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No foods found. Try adding a new food!
          </div>
        ) : (
          foods.map((food) => (
            <div
              key={food.id}
              className="group relative flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex-1">
                <h3 className="font-semibold">{food.name}</h3>
                {food.brand && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{food.brand}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {food.servingSize} • {food.calories} cal
                </p>
              </div>
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
                  onClick={() => handleAddToDiary(food)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

