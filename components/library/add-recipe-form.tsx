// components/library/add-recipe-form.tsx
"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

interface AddRecipeFormProps {
  onBack: () => void;
}

export function AddRecipeForm({ onBack }: AddRecipeFormProps) {
  const [name, setName] = useState("");
  const [servings, setServings] = useState(1);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save recipe to API
    alert("Recipe saved! (Demo - implement API)");
    onBack();
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      
      <h2 className="text-2xl font-bold">Add Recipe</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Recipe Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            required
          />
        </div>
        
        <div>
          <label className="mb-1 block text-sm font-medium">Servings</label>
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(parseInt(e.target.value))}
            min="1"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            required
          />
        </div>
        
        <div>
          <label className="mb-1 block text-sm font-medium">Instructions</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={6}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            placeholder="Enter recipe instructions..."
          />
        </div>
        
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
        >
          Save Recipe
        </button>
      </form>
    </div>
  );
}

