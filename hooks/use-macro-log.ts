// hooks/use-macro-log.ts
import { useQuery } from "@tanstack/react-query";
import type { MacroLog } from "@/types";

async function fetchMacroLog(date: string): Promise<MacroLog> {
  // TODO: Replace with actual API call
  const response = await fetch(`/api/macro-logs/${date}`);
  if (!response.ok) {
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
  return response.json();
}

export function useMacroLog(date: string) {
  return useQuery({
    queryKey: ["macroLog", date],
    queryFn: () => fetchMacroLog(date),
  });
}

