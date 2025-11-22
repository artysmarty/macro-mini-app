// hooks/use-weight-logs.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { WeightLog } from "@/types";

async function fetchWeightLogs(userId: string): Promise<WeightLog[]> {
  if (!userId) {
    return [];
  }
  
  const response = await fetch(`/api/weight-logs?userId=${encodeURIComponent(userId)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch weight logs");
  }
  const logs = await response.json();
  // Convert ISO strings back to Date objects
  return logs.map((log: any) => ({
    ...log,
    createdAt: new Date(log.createdAt),
  }));
}

async function createWeightLog(log: {
  userId: string;
  date: string;
  weight: number;
  source?: "manual" | "apple_health" | "google_fit" | "garmin" | "fitbit" | "nfc_scale";
}): Promise<WeightLog> {
  const response = await fetch("/api/weight-logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(log),
  });

  if (!response.ok) {
    throw new Error("Failed to create weight log");
  }
  const created = await response.json();
  return {
    ...created,
    createdAt: new Date(created.createdAt),
  };
}

export function useWeightLogs(userId?: string) {
  return useQuery({
    queryKey: ["weightLogs", userId],
    queryFn: () => fetchWeightLogs(userId!),
    enabled: !!userId,
  });
}

export function useCreateWeightLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWeightLog,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["weightLogs", data.userId] });
    },
  });
}

