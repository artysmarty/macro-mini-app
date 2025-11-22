// app/shared/[type]/[id]/client.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { ArrowLeft, Save, Plus, Trophy, Award } from "lucide-react";
import { format } from "date-fns";
import type { FoodItem } from "@/types";

type SharedType = "day" | "meal" | "food" | "recipe" | "achievement" | "award";

interface SharedItemPageClientProps {
  type: SharedType;
  id: string;
}

export function SharedItemPageClient({ type, id }: SharedItemPageClientProps) {
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch shared item from API based on type and id
    const fetchSharedItem = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Mock data based on type
      if (type === "day") {
        const dateStr = id.replace("day-", "");
        setItem({
          type: "day",
          date: dateStr,
          formattedDate: format(new Date(dateStr), "EEEE, MMM d, yyyy"),
        });
      } else if (type === "meal") {
        const [mealType, date] = id.split("-");
        setItem({
          type: "meal",
          mealType,
          date,
          formattedDate: format(new Date(date), "EEEE, MMM d, yyyy"),
        });
      } else if (type === "food" || type === "recipe") {
        const mockItem: FoodItem = {
          id: id,
          name: type === "recipe" ? "High-Protein Bowl" : "Chicken Breast",
          brand: "Generic",
          servingSize: "100g",
          calories: 165,
          proteinG: 31,
          carbsG: 0,
          fatsG: 3.6,
          isPublic: true,
        };
        setItem({ ...mockItem, type });
      } else if (type === "achievement") {
        setItem({
          type: "achievement",
          id,
          name: "30 Day Streak",
          description: "Logged macros for 30 consecutive days",
          unlockedAt: new Date().toISOString(),
        });
      } else if (type === "award") {
        setItem({
          type: "award",
          id,
          name: "Weight Loss Champion",
          description: "Lost 10 pounds in 30 days",
          imageUrl: "/nft-placeholder.png",
          unlockedAt: new Date().toISOString(),
        });
      }
      
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

  // Render based on type
  if (type === "day") {
    return (
      <MainLayout>
        <div className="mx-auto max-w-md space-y-4 p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold">Shared Day</h1>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-2 text-2xl font-bold">{item.formattedDate}</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              View my macro progress for this day
            </p>
            <button
              onClick={() => router.push(`/diary?date=${item.date}`)}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
            >
              View in Diary
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (type === "meal") {
    const mealLabels: Record<string, string> = {
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      snacks: "Snacks",
    };
    return (
      <MainLayout>
        <div className="mx-auto max-w-md space-y-4 p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold">Shared Meal</h1>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-2 text-2xl font-bold">{mealLabels[item.mealType] || item.mealType}</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {item.formattedDate}
            </p>
            <button
              onClick={() => router.push(`/diary?date=${item.date}`)}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
            >
              View in Diary
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (type === "achievement") {
    return (
      <MainLayout>
        <div className="mx-auto max-w-md space-y-4 p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold">Shared Achievement</h1>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600">
                <Trophy className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold">{item.name}</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
            <button
              onClick={() => router.push("/profile")}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
            >
              View Profile
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (type === "award") {
    return (
      <MainLayout>
        <div className="mx-auto max-w-md space-y-4 p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold">Shared NFT</h1>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
                <Award className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold">{item.name}</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
            <button
              onClick={() => router.push("/profile")}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
            >
              View Profile
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Food or Recipe
  return (
    <MainLayout>
      <div className="mx-auto max-w-md space-y-4 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">
            Shared {type.charAt(0).toUpperCase() + type.slice(1)}
          </h1>
        </div>

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

