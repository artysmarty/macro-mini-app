// components/library/add-food-form.tsx
"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { FoodItem } from "@/types";

interface AddFoodFormProps {
  onBack: () => void;
}

export function AddFoodForm({ onBack }: AddFoodFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    servingSize: "",
    calories: "",
    proteinG: "",
    carbsG: "",
    fatsG: "",
    barcode: "",
    isPublic: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to API
    console.log("Save food:", formData);
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Food Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            placeholder="e.g., Chicken Breast"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Brand</label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Serving Size *</label>
          <input
            type="text"
            required
            value={formData.servingSize}
            onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            placeholder="e.g., 100g or 1 cup"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Calories *</label>
            <input
              type="number"
              required
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Protein (g) *</label>
            <input
              type="number"
              required
              value={formData.proteinG}
              onChange={(e) => setFormData({ ...formData, proteinG: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Carbs (g) *</label>
            <input
              type="number"
              required
              value={formData.carbsG}
              onChange={(e) => setFormData({ ...formData, carbsG: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Fats (g) *</label>
            <input
              type="number"
              required
              value={formData.fatsG}
              onChange={(e) => setFormData({ ...formData, fatsG: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Barcode (UPC)</label>
          <input
            type="text"
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            placeholder="Optional"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={formData.isPublic}
            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="isPublic" className="text-sm">
            Make this food public (visible to all users)
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
        >
          Save Food
        </button>
      </form>
    </div>
  );
}

