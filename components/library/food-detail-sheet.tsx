// components/library/food-detail-sheet.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Share2, ChevronDown } from "lucide-react";
import { BottomSheet } from "@/components/common/bottom-sheet";
import type { FoodItem } from "@/types";

interface FoodDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  foodItem: FoodItem | null;
  onAddToMeal?: (mealType: "breakfast" | "lunch" | "dinner" | "snacks", quantity?: number) => void;
  onQuickAdd?: (quantity?: number) => void;
}

type Unit = "x" | "g" | "oz" | "cup" | "tbsp" | "tsp" | "piece" | "ml" | "fl oz";

export function FoodDetailSheet({
  isOpen,
  onClose,
  foodItem,
  onAddToMeal,
  onQuickAdd,
}: FoodDetailSheetProps) {
  const [quantity, setQuantity] = useState("1");
  const [selectedUnit, setSelectedUnit] = useState<Unit>("x");
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  // Reset when food item changes
  useEffect(() => {
    if (foodItem) {
      setQuantity("1");
      setSelectedUnit("x");
      setShowUnitPicker(false);
    }
  }, [foodItem]);

  if (!foodItem) return null;

  const mealTypes: { value: "breakfast" | "lunch" | "dinner" | "snacks"; label: string }[] = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "snacks", label: "Snack" },
  ];

  // Parse base serving size to extract amount and unit (e.g., "100g" -> 100, "g")
  const parseBaseServingSize = (servingSize: string): { amount: number; unit: string } => {
    const match = servingSize.match(/^([\d.]+)\s*(.*)$/);
    if (match) {
      return { amount: parseFloat(match[1]), unit: match[2].toLowerCase().trim() || "g" };
    }
    return { amount: 1, unit: "g" };
  };

  const baseServing = parseBaseServingSize(foodItem.servingSize);
  
  // Calculate multiplier based on quantity and selected unit
  const calculateMultiplier = (): number => {
    const qty = parseFloat(quantity) || 0;
    if (qty <= 0) return 0;

    // If unit is "x" (servings), use quantity directly
    if (selectedUnit === "x") {
      return qty;
    }

    // Convert selected unit to base unit (g) for weight-based items
    let selectedAmountInGrams = 0;
    
    // Weight conversions
    if (selectedUnit === "g") {
      selectedAmountInGrams = qty;
    } else if (selectedUnit === "oz") {
      selectedAmountInGrams = qty * 28.35; // 1 oz = 28.35g
    } else if (selectedUnit === "cup") {
      // For cups, this is approximate and varies by food type
      // Using a default: 1 cup ≈ 240g for most foods (will need to be more specific per food type)
      selectedAmountInGrams = qty * 240;
    } else if (selectedUnit === "tbsp") {
      selectedAmountInGrams = qty * 15; // 1 tbsp ≈ 15g
    } else if (selectedUnit === "tsp") {
      selectedAmountInGrams = qty * 5; // 1 tsp ≈ 5g
    } else if (selectedUnit === "piece") {
      // For pieces, assume 1 piece = base serving
      return qty;
    } else if (selectedUnit === "ml") {
      selectedAmountInGrams = qty * 1; // 1ml ≈ 1g for water/liquids
    } else if (selectedUnit === "fl oz") {
      selectedAmountInGrams = qty * 29.57; // 1 fl oz = 29.57ml ≈ 29.57g
    }

    // Convert base serving to grams if needed
    let baseAmountInGrams = baseServing.amount;
    if (baseServing.unit === "oz") {
      baseAmountInGrams = baseServing.amount * 28.35;
    } else if (baseServing.unit === "cup") {
      baseAmountInGrams = baseServing.amount * 240;
    } else if (baseServing.unit === "tbsp") {
      baseAmountInGrams = baseServing.amount * 15;
    } else if (baseServing.unit === "tsp") {
      baseAmountInGrams = baseServing.amount * 5;
    } else if (baseServing.unit === "ml") {
      baseAmountInGrams = baseServing.amount;
    } else if (baseServing.unit === "fl oz") {
      baseAmountInGrams = baseServing.amount * 29.57;
    }

    if (baseAmountInGrams === 0) return qty;
    
    // Calculate multiplier: selected amount / base serving amount
    return selectedAmountInGrams / baseAmountInGrams;
  };

  const multiplier = calculateMultiplier();
  
  const adjustedCalories = Math.round((foodItem.calories || 0) * multiplier);
  const adjustedProtein = Math.round((foodItem.proteinG || 0) * multiplier);
  const adjustedCarbs = Math.round((foodItem.carbsG || 0) * multiplier);
  const adjustedFats = Math.round((foodItem.fatsG || 0) * multiplier);

  const handleMealSelect = (mealType: "breakfast" | "lunch" | "dinner" | "snacks") => {
    onAddToMeal?.(mealType, multiplier);
    onClose();
  };
  
  const handleQuickAdd = () => {
    console.log("FoodDetailSheet handleQuickAdd called:", { 
      foodItem: foodItem?.name, 
      quantity: quantity, 
      selectedUnit, 
      multiplier 
    });
    onQuickAdd?.(multiplier);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} centered={true}>
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
          
          {/* Quantity Input and Unit Selector */}
          <div className="flex items-center gap-2">
            {/* Quantity Input */}
            <div className="flex-1">
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty, decimals, and numbers
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    setQuantity(value);
                  }
                }}
                onBlur={(e) => {
                  // Ensure value is valid on blur
                  const value = parseFloat(e.target.value);
                  if (isNaN(value) || value <= 0) {
                    setQuantity("1");
                  } else {
                    setQuantity(value.toString());
                  }
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-2xl font-bold text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-hover dark:text-dark-text"
                placeholder="1"
              />
            </div>
            
            {/* Unit Selector */}
            <div className="relative">
              <button
                onClick={() => setShowUnitPicker(!showUnitPicker)}
                className="flex h-12 min-w-[80px] items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:border-dark-border dark:bg-dark-hover dark:hover:bg-gray-700"
              >
                <span className="text-gray-900 dark:text-dark-text">
                  {selectedUnit === "x" ? "servings" : selectedUnit}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              
              {/* Unit Picker Dropdown */}
              {showUnitPicker && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUnitPicker(false)}
                  />
                  <div className="absolute right-0 top-full z-20 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="max-h-60 overflow-y-auto p-1">
                      {([
                        { value: "x", label: "servings" },
                        { value: "g", label: "g (grams)" },
                        { value: "oz", label: "oz (ounces)" },
                        { value: "cup", label: "cup" },
                        { value: "tbsp", label: "tbsp" },
                        { value: "tsp", label: "tsp" },
                        { value: "piece", label: "piece" },
                        { value: "ml", label: "ml" },
                        { value: "fl oz", label: "fl oz" },
                      ] as { value: Unit; label: string }[]).map((unit) => (
                        <button
                          key={unit.value}
                          onClick={() => {
                            setSelectedUnit(unit.value);
                            setShowUnitPicker(false);
                          }}
                          className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                            selectedUnit === unit.value
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          }`}
                        >
                          {unit.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Base Serving Size Display */}
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Base: {foodItem.servingSize}
          </div>
        </div>

        {/* Meal Picker - Always visible */}
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
            onClick={onClose}
            className="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-dark-hover dark:text-gray-400 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

