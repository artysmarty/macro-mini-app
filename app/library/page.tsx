// app/library/page.tsx
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { FoodLibraryScreen } from "@/components/library/food-library-screen";

export default function LibraryPage() {
  const handleAddToMeal = (
    foodItem: any,
    mealType: "breakfast" | "lunch" | "dinner" | "snacks"
  ) => {
    // TODO: Add food to diary for selected meal
    console.log("Add", foodItem.name, "to", mealType);
  };

  const handleQuickAdd = (foodItem: any) => {
    // TODO: Quick add to diary
    console.log("Quick add", foodItem.name);
  };

  return (
    <MainLayout>
      <FoodLibraryScreen onAddToMeal={handleAddToMeal} onQuickAdd={handleQuickAdd} />
    </MainLayout>
  );
}
