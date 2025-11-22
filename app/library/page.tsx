// app/library/page.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MainLayout } from "@/components/layout/main-layout";
import { FoodLibraryScreen } from "@/components/library/food-library-screen";
import { useCreateDiaryEntry } from "@/hooks/use-diary-entries";
import { useAuth } from "@/contexts/auth-context";
import type { FoodItem } from "@/types";

// Helper function to get consistent userId (same as in diary page)
function getUserId(fid: number | null | undefined): string {
  if (fid) {
    return `fid-${fid}`;
  }
  // Use localStorage to persist dev userId across page refreshes (consistent with diary page)
  if (typeof window !== 'undefined') {
    let devUserId = localStorage.getItem('devUserId');
    if (!devUserId) {
      devUserId = `fid-dev-${Date.now()}`;
      localStorage.setItem('devUserId', devUserId);
    }
    return devUserId;
  }
  return `fid-dev-${Date.now()}`;
}

export default function LibraryPage() {
  const { fid } = useAuth();
  const createEntry = useCreateDiaryEntry();
  const [selectedDate] = useState(new Date()); // Default to today

  const handleAddToMeal = async (
    foodItem: FoodItem,
    mealType: "breakfast" | "lunch" | "dinner" | "snacks",
    quantity?: number
  ) => {
    const userId = getUserId(fid);
    const date = format(selectedDate, "yyyy-MM-dd");
    
    console.log("Library handleAddToMeal called:", { foodItem: foodItem.name, mealType, quantity, userId, date });

    try {
      // For food items from library
      let foodItemId = foodItem.id;
      
      // Generate stable ID for new items if needed
      if (foodItem.id.startsWith("barcode-") || foodItem.id.startsWith("demo-")) {
        foodItemId = foodItem.barcode ? `food-${foodItem.barcode}` : `food-${Date.now()}-${foodItem.name.replace(/\s+/g, "-").toLowerCase()}`;
      }
      
      // Always send food item data so API can save it if it doesn't exist
      const foodItemData = {
        ...foodItem,
        id: foodItemId,
        createdByUserId: userId,
        isPublic: foodItem.isPublic !== undefined ? foodItem.isPublic : true,
      };
      
      // Create diary entry with food item data
      const entryPayload: any = {
        userId,
        date,
        mealType,
        type: "food",
        foodItemId: foodItemId,
        quantity: quantity ?? 1,
        foodItemData: foodItemData,
      };
      
      await createEntry.mutateAsync(entryPayload);
      console.log("Food added to diary from library:", { foodItem: foodItem.name, mealType, quantity });
      
      // Show success message (optional)
      // alert(`Added ${foodItem.name} to ${mealType}`);
    } catch (error) {
      console.error("Error adding food to diary from library:", error);
      alert("Failed to add food to diary. Please try again.");
    }
  };

  const handleQuickAdd = (foodItem: FoodItem) => {
    // Quick Add is not used when meal selection buttons are available
    // But we can default to snacks or show an alert
    console.log("Quick add called from library - this should not happen", foodItem.name);
  };

  return (
    <MainLayout>
      <FoodLibraryScreen onAddToMeal={handleAddToMeal} onQuickAdd={handleQuickAdd} />
    </MainLayout>
  );
}
