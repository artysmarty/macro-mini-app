// components/library/quick-add-macros.tsx
"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useAccount } from "wagmi";

interface QuickAddMacrosProps {
  onBack: () => void;
}

export function QuickAddMacros({ onBack }: QuickAddMacrosProps) {
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    name: "",
    proteinG: "",
    carbsG: "",
    fatsG: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const today = format(new Date(), "yyyy-MM-dd");
    
    // Calculate calories from macros (4 cal/g for protein and carbs, 9 cal/g for fat)
    const calories = (parseFloat(formData.proteinG) || 0) * 4 + 
                     (parseFloat(formData.carbsG) || 0) * 4 + 
                     (parseFloat(formData.fatsG) || 0) * 9;
    
    // TODO: Save to diary via API
    const entry = {
      userId: address || "",
      date: today,
      mealType: "snacks" as const,
      type: "quick" as const,
      quickCalories: Math.round(calories),
      quickProteinG: parseFloat(formData.proteinG) || 0,
      quickCarbsG: parseFloat(formData.carbsG) || 0,
      quickFatsG: parseFloat(formData.fatsG) || 0,
    };

    console.log("Quick add entry:", entry);
    alert("Macros added to diary!");
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

      <div>
        <h2 className="text-xl font-bold">Quick Add</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter macros for quick logging
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Title</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
            placeholder="e.g., Protein shake"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Protein (g)</label>
            <input
              type="number"
              value={formData.proteinG}
              onChange={(e) => setFormData({ ...formData, proteinG: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Carbs (g)</label>
            <input
              type="number"
              value={formData.carbsG}
              onChange={(e) => setFormData({ ...formData, carbsG: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Fat (g)</label>
            <input
              type="number"
              value={formData.fatsG}
              onChange={(e) => setFormData({ ...formData, fatsG: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-4 py-4 text-base font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Add to Diary
        </button>
      </form>
    </div>
  );
}

