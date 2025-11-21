// components/dashboard/photo-timeline.tsx
"use client";

export function PhotoTimeline() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold">Progress Timeline</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex-shrink-0 rounded-lg bg-gray-200 p-8 dark:bg-gray-700"
          >
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Photo {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

