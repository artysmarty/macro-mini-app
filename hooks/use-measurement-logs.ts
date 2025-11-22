// hooks/use-measurement-logs.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { MeasurementLog, BodyMeasurements } from "@/types";

async function fetchMeasurementLogs(userId: string): Promise<MeasurementLog[]> {
  if (!userId) {
    return [];
  }
  
  const response = await fetch(`/api/measurement-logs?userId=${encodeURIComponent(userId)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch measurement logs");
  }
  const logs = await response.json();
  // Convert ISO strings back to Date objects
  return logs.map((log: any) => ({
    ...log,
    createdAt: new Date(log.createdAt),
  }));
}

async function createMeasurementLog(log: {
  userId: string;
  date: string;
  measurements: BodyMeasurements;
}): Promise<MeasurementLog> {
  const response = await fetch("/api/measurement-logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(log),
  });

  if (!response.ok) {
    throw new Error("Failed to create measurement log");
  }
  const created = await response.json();
  return {
    ...created,
    createdAt: new Date(created.createdAt),
  };
}

export function useMeasurementLogs(userId?: string) {
  return useQuery({
    queryKey: ["measurementLogs", userId],
    queryFn: () => fetchMeasurementLogs(userId!),
    enabled: !!userId,
  });
}

export function useCreateMeasurementLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMeasurementLog,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["measurementLogs", data.userId] });
    },
  });
}

