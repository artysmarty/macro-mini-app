// components/ai/meal-suggestions.tsx
"use client";

import { useState } from "react";
import { Sparkles, ChefHat, Copy, Check } from "lucide-react";
import { useMacroLog } from "@/hooks/use-macro-log";
import { format } from "date-fns";
import { useAccount } from "wagmi";

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

interface MealSuggestionsProps {
  onSelectMeal?: (meal: MealSuggestion) => void;
}

// Mock AI suggestions - in production, use OpenAI API or similar
async function generateMealSuggestions(
  remainingMacros: { calories: number; protein: number; carbs: number; fats: number },
  availableIngredients: string[]
): Promise<MealSuggestion[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simple rule-based suggestions (replace with AI in production)
  const suggestions: MealSuggestion[] = [];

  if (availableIngredients.some((i) => i.includes("chicken"))) {
    suggestions.push({
      name: "Grilled Chicken with Rice and Vegetables",
      ingredients: ["chicken breast", "brown rice", "broccoli", "olive oil"],
      instructions: "1. Season chicken and grill 6-8 min per side\n2. Cook rice according to package\n3. Steam broccoli and drizzle with olive oil",
      portionSize: "150g chicken, 100g rice, 100g broccoli",
      macros: {
        calories: Math.min(remainingMacros.calories, 450),
        proteinG: Math.min(remainingMacros.protein, 45),
        carbsG: Math.min(remainingMacros.carbs, 35),
        fatsG: Math.min(remainingMacros.fats, 12),
      },
    });
  }

  if (availableIngredients.some((i) => i.includes("salmon"))) {
    suggestions.push({
      name: "Baked Salmon with Quinoa",
      ingredients: ["salmon fillet", "quinoa", "spinach", "lemon"],
      instructions: "1. Bake salmon at 400°F for 12-15 min\n2. Cook quinoa in vegetable broth\n3. Sauté spinach with lemon juice",
      portionSize: "150g salmon, 80g quinoa, 50g spinach",
      macros: {
        calories: Math.min(remainingMacros.calories, 380),
        proteinG: Math.min(remainingMacros.protein, 35),
        carbsG: Math.min(remainingMacros.carbs, 28),
        fatsG: Math.min(remainingMacros.fats, 15),
      },
    });
  }

  // Fallback suggestions
  if (suggestions.length === 0) {
    suggestions.push({
      name: "High-Protein Bowl",
      ingredients: ["protein source", "carb source", "vegetables", "healthy fats"],
      instructions: "Combine your preferred protein, carbs, vegetables, and fats to create a balanced meal.",
      portionSize: "Adjust based on remaining macros",
      macros: {
        calories: remainingMacros.calories * 0.3,
        proteinG: remainingMacros.protein * 0.3,
        carbsG: remainingMacros.carbs * 0.3,
        fatsG: remainingMacros.fats * 0.3,
      },
    });
  }

  return suggestions;
}

export function MealSuggestions({ onSelectMeal }: MealSuggestionsProps) {
  const { address } = useAccount();
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: macroLog } = useMacroLog(today);
  const [copiedMealIndex, setCopiedMealIndex] = useState<number | null>(null);
  
  // Copy recipe instructions to clipboard
  const handleCopyRecipe = async (instructions: string, mealIndex: number) => {
    try {
      await navigator.clipboard.writeText(instructions);
      setCopiedMealIndex(mealIndex);
      setTimeout(() => setCopiedMealIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy recipe. Please try again.");
    }
  };
  const [ingredients, setIngredients] = useState("");
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock target macros - replace with actual user profile
  const targetMacros = {
    calories: 2400,
    protein: 180,
    carbs: 240,
    fats: 80,
  };

  const consumed = macroLog || {
    calories: 0,
    proteinG: 0,
    carbsG: 0,
    fatsG: 0,
  };

  const remainingMacros = {
    calories: Math.max(0, targetMacros.calories - consumed.calories),
    protein: Math.max(0, targetMacros.protein - consumed.proteinG),
    carbs: Math.max(0, targetMacros.carbs - consumed.carbsG),
    fats: Math.max(0, targetMacros.fats - consumed.fatsG),
  };

  const handleGetSuggestions = async () => {
    if (!ingredients.trim()) {
      alert("Please enter some ingredients");
      return;
    }

    setLoading(true);
    setShowSuggestions(true);

    const ingredientList = ingredients
      .split(",")
      .map((i) => i.trim().toLowerCase())
      .filter(Boolean);

    try {
      const mealSuggestions = await generateMealSuggestions(remainingMacros, ingredientList);
      setSuggestions(mealSuggestions);
    } catch (error) {
      console.error("Error generating suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">AI Meal Suggestions</h3>
        </div>
        <p className="mb-4 text-sm text-blue-800 dark:text-blue-200">
          Get personalized meal ideas based on your remaining macros and available ingredients.
        </p>

        <div className="mb-4 space-y-2">
          <label className="block text-sm font-medium text-blue-900 dark:text-blue-100">
            Available Ingredients
          </label>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g., chicken breast, rice, broccoli, olive oil"
            className="w-full rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm dark:border-blue-700 dark:bg-gray-700"
          />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Separate ingredients with commas
          </p>
        </div>

        <button
          onClick={handleGetSuggestions}
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating suggestions..." : "Get Meal Suggestions"}
        </button>
      </div>

      {showSuggestions && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Suggested Meals</h4>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Hide
            </button>
          </div>

          {suggestions.length === 0 && !loading && (
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800">
              No suggestions available. Try different ingredients.
            </div>
          )}

          {suggestions.map((meal, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <ChefHat className="h-4 w-4 text-orange-500" />
                    <h5 className="font-semibold">{meal.name}</h5>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Portion: {meal.portionSize}
                  </p>
                </div>
                <button
                  onClick={() => handleCopyRecipe(meal.instructions, index)}
                  className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 dark:text-primary-light dark:hover:bg-primary/20 transition-colors whitespace-nowrap"
                  title="Copy recipe instructions to clipboard"
                >
                  {copiedMealIndex === index ? (
                    <>
                      <Check className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy Recipe</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mb-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                <div className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                  Ingredients:
                </div>
                <div className="flex flex-wrap gap-1">
                  {meal.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="rounded bg-white px-2 py-1 text-xs dark:bg-gray-600"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-3 rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-700/50">
                <div className="mb-1 font-medium">Instructions:</div>
                <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                  {meal.instructions}
                </div>
              </div>

              <div className="mb-3 grid grid-cols-4 gap-2 text-xs">
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Cal</div>
                  <div className="font-semibold">{meal.macros.calories}</div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">P</div>
                  <div className="font-semibold">{meal.macros.proteinG}g</div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">C</div>
                  <div className="font-semibold">{meal.macros.carbsG}g</div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">F</div>
                  <div className="font-semibold">{meal.macros.fatsG}g</div>
                </div>
              </div>

              {onSelectMeal && (
                <button
                  onClick={() => onSelectMeal(meal)}
                  className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Log This Meal
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
        <div className="font-semibold mb-1">Remaining Macros:</div>
        <div className="grid grid-cols-4 gap-2">
          <div>Cal: {remainingMacros.calories}</div>
          <div>P: {remainingMacros.protein.toFixed(0)}g</div>
          <div>C: {remainingMacros.carbs.toFixed(0)}g</div>
          <div>F: {remainingMacros.fats.toFixed(0)}g</div>
        </div>
      </div>
    </div>
  );
}

