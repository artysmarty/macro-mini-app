// components/diary/diary-entry-list.tsx
"use client";

interface DiaryEntryListProps {
  mealType: "breakfast" | "lunch" | "dinner" | "snacks";
}

export function DiaryEntryList({ mealType }: DiaryEntryListProps) {
  // Mock data - will be replaced with actual API data
  const entries: any[] = [];

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div key={entry.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
          <div>
            <p className="font-medium">{entry.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {entry.calories} cal
            </p>
          </div>
          <button className="text-sm text-red-600 hover:text-red-700 dark:text-red-400">
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

