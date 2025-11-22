// hooks/use-macro-log.ts
import { useQuery } from "@tanstack/react-query";
import type { MacroLog } from "@/types";

async function fetchMacroLog(date: string, userId?: string): Promise<MacroLog> {
  if (!userId) {
    return {
      userId: "",
      date,
      calories: 0,
      proteinG: 0,
      carbsG: 0,
      fatsG: 0,
      hitTarget: false,
    };
  }
  
  const response = await fetch(`/api/macro-logs/${date}?userId=${encodeURIComponent(userId)}`);
  if (!response.ok) {
    // Return empty log if error
    return {
      userId,
      date,
      calories: 0,
      proteinG: 0,
      carbsG: 0,
      fatsG: 0,
      hitTarget: false,
    };
  }
  return response.json();
}

export function useMacroLog(date: string, userId?: string) {
  return useQuery({
    queryKey: ["macroLog", date, userId],
    queryFn: () => fetchMacroLog(date, userId),
    enabled: !!userId && !!date,
  });
}

