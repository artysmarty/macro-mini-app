// app/diary/page.tsx
"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { AppBar } from "@/components/layout/app-bar";
import { MacroSummaryBar } from "@/components/dashboard/macro-summary-bar";
import { DiaryDatePicker } from "@/components/diary/diary-date-picker";
import { MealSection } from "@/components/diary/meal-section";
import { AddBottomSheet } from "@/components/common/add-bottom-sheet";

const mealTypes = ["breakfast", "lunch", "dinner", "snacks"] as const;

export default function DiaryPage() {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <MainLayout>
      <div className="flex min-h-screen flex-col">
        <AppBar title={<DiaryDatePicker />} />
        <MacroSummaryBar />
        
        <main className="flex-1 space-y-3 p-4 pb-24">
          {mealTypes.map((mealType) => (
            <MealSection key={mealType} mealType={mealType} onAddClick={() => setShowAddSheet(true)} />
          ))}
        </main>
      </div>

      <AddBottomSheet isOpen={showAddSheet} onClose={() => setShowAddSheet(false)} />
    </MainLayout>
  );
}
