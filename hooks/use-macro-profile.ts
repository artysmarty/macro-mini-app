// hooks/use-macro-profile.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { MacroProfile } from "@/types";

async function fetchMacroProfile(userId: string): Promise<MacroProfile | null> {
  if (!userId) {
    return null;
  }
  
  const response = await fetch(`/api/macro-profiles?userId=${encodeURIComponent(userId)}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null; // Profile doesn't exist yet
    }
    throw new Error("Failed to fetch macro profile");
  }
  return response.json();
}

async function updateMacroProfile(profile: {
  userId: string;
  dailyCalories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  source: "computed" | "manual";
}): Promise<MacroProfile> {
  const response = await fetch("/api/macro-profiles", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    throw new Error("Failed to update macro profile");
  }
  return response.json();
}

export function useMacroProfile(userId?: string) {
  return useQuery({
    queryKey: ["macroProfile", userId],
    queryFn: () => fetchMacroProfile(userId!),
    enabled: !!userId,
  });
}

export function useUpdateMacroProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMacroProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["macroProfile", data.userId] });
      // Also invalidate macro logs since targets may have changed
      queryClient.invalidateQueries({ queryKey: ["macroLog"] });
    },
  });
}

