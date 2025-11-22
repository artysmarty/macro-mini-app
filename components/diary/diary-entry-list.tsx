// components/diary/diary-entry-list.tsx
"use client";

import { format } from "date-fns";
import { useDiaryEntries, useDeleteDiaryEntry } from "@/hooks/use-diary-entries";
import { useAuth } from "@/contexts/auth-context";
import type { DiaryEntry, FoodItem } from "@/types";

interface DiaryEntryListProps {
  mealType: "breakfast" | "lunch" | "dinner" | "snacks";
  selectedDate?: Date;
}

export function DiaryEntryList({ mealType, selectedDate = new Date() }: DiaryEntryListProps) {
  const { fid } = useAuth();
  const date = format(selectedDate, "yyyy-MM-dd");
  
  // Use consistent userId - match the logic from DiaryPage
  const getUserId = () => {
    if (fid) {
      return `fid-${fid}`;
    }
    // Use the same dev userId from localStorage
    if (typeof window !== 'undefined') {
      const devUserId = localStorage.getItem('devUserId');
      return devUserId || "";
    }
    return "";
  };
  
  const userId = getUserId();
  const { data: entries = [], isLoading, error } = useDiaryEntries(userId, date, mealType);
  const deleteEntry = useDeleteDiaryEntry();
  
  console.log("DiaryEntryList:", {
    mealType,
    date,
    userId,
    entriesCount: entries.length,
    entries,
    isLoading,
    error
  });

  // Show a message if loading or if no entries (for debugging)
  if (isLoading) {
    return <div className="py-4 text-center text-sm text-gray-500">Loading entries...</div>;
  }
  
  if (entries.length === 0) {
    // Don't hide - show a message for debugging
    return (
      <div className="py-4 text-center text-sm text-gray-500">
        No entries yet. Add food items to see them here.
      </div>
    );
  }

  const handleRemove = async (entryId: string) => {
    if (confirm("Remove this item from your diary?")) {
      try {
        await deleteEntry.mutateAsync(entryId);
      } catch (error) {
        console.error("Error removing entry:", error);
        alert("Failed to remove item. Please try again.");
      }
    }
  };

  // Entries are enriched with foodItem data from the API
  const getEntryName = (entry: DiaryEntry & { foodItem?: FoodItem }): string => {
    if (entry.type === "quick") {
      // Use stored quickName if available (for Quick Add and AI meals)
      return (entry as any).quickName || "Quick Add";
    }
    if (entry.foodItemId && (entry as any).foodItem) {
      return (entry as any).foodItem.name || "Food Item";
    }
    return "Food Item";
  };
  
  const getEntryCalories = (entry: DiaryEntry & { foodItem?: FoodItem }): number => {
    if (entry.type === "quick") {
      return (entry.quickCalories || 0) * (entry.quantity || 1);
    }
    if (entry.foodItemId && (entry as any).foodItem) {
      const foodItem = (entry as any).foodItem;
      return (foodItem.calories || 0) * (entry.quantity || 1);
    }
    return 0;
  };

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div key={entry.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-dark-text">{getEntryName(entry)}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {getEntryCalories(entry)} cal
            </p>
          </div>
          <button 
            onClick={() => handleRemove(entry.id)}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

