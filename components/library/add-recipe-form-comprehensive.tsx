// components/library/add-recipe-form-comprehensive.tsx
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import type { FoodItem } from "@/types";

interface AddRecipeFormComprehensiveProps {
  onBack: () => void;
  onSaveRef?: (saveFn: () => void) => void;
  onFormChange?: (isValid: boolean) => void;
}

interface RecipeIngredient {
  id: string;
  foodItem: FoodItem;
  amount: string;
  unit: string;
}

const weightUnits = ["g", "oz", "lb", "ml", "tsp", "tbsp", "fl oz", "cup"];

// Mock library items - will be replaced with actual API data
const mockLibraryItems: FoodItem[] = [
  {
    id: "1",
    name: "King Arthur Gluten Free Flour",
    brand: "King Arthur",
    servingSize: "120g",
    calories: 420,
    proteinG: 8,
    carbsG: 84,
    fatsG: 2,
    isPublic: true,
  },
  {
    id: "2",
    name: "Eggs",
    brand: "Generic",
    servingSize: "1 large",
    calories: 70,
    proteinG: 6,
    carbsG: 0.5,
    fatsG: 5,
    isPublic: true,
  },
];

export function AddRecipeFormComprehensive({
  onBack,
  onSaveRef,
  onFormChange,
}: AddRecipeFormComprehensiveProps) {
  const [formData, setFormData] = useState({
    name: "",
    servings: "",
    servingSize: "",
    weightAfterCooking: "",
    weightAfterCookingUnit: "g",
    weightBeforeCooking: "",
    weightBeforeCookingUnit: "g",
  });

  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [showIngredientPicker, setShowIngredientPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Validate form
  useEffect(() => {
    const isValid = !!(
      formData.name &&
      formData.servings &&
      formData.servingSize &&
      ingredients.length > 0
    );
    onFormChange?.(isValid);
  }, [formData, ingredients, onFormChange]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddIngredient = () => {
    setShowIngredientPicker(true);
  };

  const handleSelectIngredient = (foodItem: FoodItem) => {
    const newIngredient: RecipeIngredient = {
      id: Date.now().toString(),
      foodItem,
      amount: "",
      unit: "g",
    };
    setIngredients((prev) => [...prev, newIngredient]);
    setShowIngredientPicker(false);
    setSearchQuery("");
  };

  const handleUpdateIngredient = (id: string, field: string, value: string) => {
    setIngredients((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing))
    );
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  const filteredLibraryItems = mockLibraryItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    // TODO: Save recipe to API
    console.log("Save recipe:", { formData, ingredients });
    // Success callback will be handled by parent
  };

  useEffect(() => {
    if (onSaveRef) {
      onSaveRef(handleSubmit);
    }
  }, [onSaveRef, formData, ingredients]);

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="space-y-4">
        {/* Name Section */}
        <div className="rounded-xl border border-gray-300 p-4 dark:border-dark-border">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
            placeholder="e.g., Gluten-Free Pancakes"
          />
        </div>

        {/* Servings Section */}
        <div className="rounded-xl border border-gray-300 p-4 dark:border-dark-border">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Servings (numbers only) *
          </label>
          <input
            type="number"
            required
            min="1"
            value={formData.servings}
            onChange={(e) => updateField("servings", e.target.value)}
            inputMode="numeric"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
            placeholder="4"
          />
        </div>

        {/* Ingredients Section */}
        <div className="rounded-xl border border-gray-300 p-4 dark:border-dark-border">
          <div className="mb-3 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ingredients *
            </label>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-dark-border dark:text-gray-300 dark:hover:bg-dark-hover"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          {/* Ingredient Picker Modal */}
          {showIngredientPicker && (
            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-dark-border dark:bg-dark-hover">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search library..."
                className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
                autoFocus
              />
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {filteredLibraryItems.length === 0 ? (
                  <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No items found
                  </p>
                ) : (
                  filteredLibraryItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectIngredient(item)}
                      className="w-full rounded-lg border border-gray-200 bg-white p-3 text-left transition-colors hover:bg-gray-100 dark:border-dark-border dark:bg-dark-card dark:hover:bg-dark-hover"
                    >
                      <div className="font-medium text-gray-900 dark:text-dark-text">
                        {item.name}
                      </div>
                      {item.brand && (
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {item.brand}
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
              <button
                onClick={() => {
                  setShowIngredientPicker(false);
                  setSearchQuery("");
                }}
                className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-dark-border dark:text-gray-300 dark:hover:bg-dark-hover"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Ingredients List */}
          <div className="space-y-2">
            {ingredients.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No ingredients added yet. Click &quot;+&quot; to add from library.
              </p>
            ) : (
              ingredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 dark:border-dark-border"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-dark-text">
                      {ingredient.foodItem.name}
                    </div>
                    {ingredient.foodItem.brand && (
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {ingredient.foodItem.brand}
                      </div>
                    )}
                    <div className="mt-2 flex gap-2">
                      <input
                        type="number"
                        value={ingredient.amount}
                        onChange={(e) =>
                          handleUpdateIngredient(ingredient.id, "amount", e.target.value)
                        }
                        placeholder="Amount"
                        inputMode="decimal"
                        className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
                      />
                      <select
                        value={ingredient.unit}
                        onChange={(e) =>
                          handleUpdateIngredient(ingredient.id, "unit", e.target.value)
                        }
                        className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
                      >
                        {weightUnits.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveIngredient(ingredient.id)}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Serving Size Section */}
        <div className="rounded-xl border border-gray-300 p-4 dark:border-dark-border">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Serving Size *
          </label>
          <input
            type="text"
            required
            value={formData.servingSize}
            onChange={(e) => updateField("servingSize", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
            placeholder="e.g., 2 pancakes"
          />
        </div>

        {/* Weight After Cooking (Optional) */}
        <div className="rounded-xl border border-gray-300 p-4 dark:border-dark-border">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Weight After Cooking (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={formData.weightAfterCooking}
              onChange={(e) => updateField("weightAfterCooking", e.target.value)}
              inputMode="decimal"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
              placeholder="0"
            />
            <select
              value={formData.weightAfterCookingUnit}
              onChange={(e) => updateField("weightAfterCookingUnit", e.target.value)}
              className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
            >
              {weightUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Weight Before Cooking (Optional) */}
        <div className="rounded-xl border border-gray-300 p-4 dark:border-dark-border">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Weight Before Cooking (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={formData.weightBeforeCooking}
              onChange={(e) => updateField("weightBeforeCooking", e.target.value)}
              inputMode="decimal"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
              placeholder="0"
            />
            <select
              value={formData.weightBeforeCookingUnit}
              onChange={(e) => updateField("weightBeforeCookingUnit", e.target.value)}
              className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
            >
              {weightUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

