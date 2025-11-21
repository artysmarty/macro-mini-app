// app/shared/[type]/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { ArrowLeft, Save, Plus } from "lucide-react";
import type { FoodItem } from "@/types";

type SharedType = "food" | "meal" | "recipe";

export default function SharedItemPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as SharedType;
  const id = params.id as string;

  const [item, setItem] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch shared item from API
    // For now, use mock data
    const fetchSharedItem = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Mock data based on type
      const mockItem: FoodItem = {
        id: id,
        name: "Chicken Breast",
        brand: "Generic",
        servingSize: "100g",
        calories: 165,
        proteinG: 31,
        carbsG: 0,
        fatsG: 3.6,
        isPublic: true,
      };
      
      setItem(mockItem);
      setLoading(false);
    };

    fetchSharedItem();
  }, [type, id]);

  const handleSaveToLibrary = async () => {
    // TODO: Save to user's library
    alert("Saved to library! (Demo)");
    router.push("/library");
  };

  const handleAddToDiary = async () => {
    // TODO: Add to today's diary
    router.push("/diary");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-md p-4">
          <div className="py-8 text-center">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (!item) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-md p-4">
          <div className="py-8 text-center">Item not found</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-md space-y-4 p-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">Shared {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
        </div>

        {/* Item Details */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-2 text-2xl font-bold">{item.name}</h2>
          {item.brand && (
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{item.brand}</p>
          )}

          <div className="mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Serving Size:</span>
              <span className="font-medium">{item.servingSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Calories:</span>
              <span className="font-medium">{item.calories} kcal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Protein:</span>
              <span className="font-medium">{item.proteinG}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Carbs:</span>
              <span className="font-medium">{item.carbsG}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Fats:</span>
              <span className="font-medium">{item.fatsG}g</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSaveToLibrary}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <Save className="h-5 w-5" />
              Save to Library
            </button>
            <button
              onClick={handleAddToDiary}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Add to Diary
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

