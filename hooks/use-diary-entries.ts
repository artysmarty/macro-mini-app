// hooks/use-diary-entries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DiaryEntry } from "@/types";

async function fetchDiaryEntries(
  userId: string,
  date: string,
  mealType?: "breakfast" | "lunch" | "dinner" | "snacks"
): Promise<DiaryEntry[]> {
  if (!userId || !date) {
    console.warn("fetchDiaryEntries called with missing userId or date:", { userId, date, mealType });
    return [];
  }
  
  const params = new URLSearchParams({
    userId,
    date,
    ...(mealType && { mealType }),
  });

  const url = `/api/diary-entries?${params}`;
  console.log("Fetching diary entries from:", url);
  
  const response = await fetch(url);
  if (!response.ok) {
    console.error("Failed to fetch diary entries:", response.status, response.statusText);
    const errorText = await response.text();
    console.error("Error response:", errorText);
    return [];
  }
  
  const entries = await response.json();
  console.log("Fetched diary entries:", entries);
  return entries;
}

async function createDiaryEntry(entry: {
  userId: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snacks";
  type: "food" | "meal" | "recipe" | "quick";
  foodItemId?: string;
  mealId?: string;
  recipeId?: string;
  quickCalories?: number;
  quickProteinG?: number;
  quickCarbsG?: number;
  quickFatsG?: number;
  quickName?: string; // Name for quick add entries
  quickInstructions?: string; // Recipe instructions for AI meals
  quantity?: number;
  foodItemData?: any; // Optional food item data for new items
}): Promise<DiaryEntry> {
  const response = await fetch("/api/diary-entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    throw new Error("Failed to create diary entry");
  }
  return response.json();
}

async function deleteDiaryEntryById(id: string): Promise<void> {
  const response = await fetch(`/api/diary-entries?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete diary entry");
  }
}

export function useDiaryEntries(
  userId: string,
  date: string,
  mealType?: "breakfast" | "lunch" | "dinner" | "snacks"
) {
  return useQuery({
    queryKey: ["diaryEntries", userId, date, mealType],
    queryFn: () => fetchDiaryEntries(userId, date, mealType),
    enabled: !!userId && !!date,
  });
}

export function useCreateDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDiaryEntry,
    onSuccess: (data) => {
      // Invalidate and refetch diary entries for the date and meal type
      queryClient.invalidateQueries({
        queryKey: ["diaryEntries", data.userId, data.date, data.mealType],
      });
      // Also invalidate all diary entries for this date (to update all meal sections)
      queryClient.invalidateQueries({
        queryKey: ["diaryEntries", data.userId, data.date],
      });
      // Also invalidate macro log with userId
      queryClient.invalidateQueries({
        queryKey: ["macroLog", data.date, data.userId],
      });
      console.log("Diary entry created successfully, invalidating queries:", {
        userId: data.userId,
        date: data.date,
        mealType: data.mealType,
        entryId: data.id
      });
    },
    onError: (error) => {
      console.error("Error creating diary entry:", error);
    },
  });
}

export function useDeleteDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDiaryEntryById,
    onSuccess: () => {
      // Invalidate all diary entries queries
      queryClient.invalidateQueries({ queryKey: ["diaryEntries"] });
      // Also invalidate all macro logs (since we don't know the date/userId from delete)
      // The macro log will be recalculated when entries are fetched
      queryClient.invalidateQueries({ queryKey: ["macroLog"] });
    },
  });
}

