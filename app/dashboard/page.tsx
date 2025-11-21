// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { AppBar } from "@/components/layout/app-bar";
import { MacroSummaryBar } from "@/components/dashboard/macro-summary-bar";
import { AddBottomSheet } from "@/components/common/add-bottom-sheet";
import { ProgressAnalytics } from "@/components/dashboard/progress-analytics";
import { RewardsCard } from "@/components/dashboard/rewards-card";
import { PhotoCarousel } from "@/components/dashboard/photo-carousel";
import { StreaksGrid } from "@/components/dashboard/streaks-grid";

export default function DashboardPage() {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <MainLayout>
      <div className="flex min-h-screen flex-col">
        <AppBar title="Dashboard" />
        <MacroSummaryBar onLogFoodClick={() => setShowAddSheet(true)} />
        
        <main className="flex-1 space-y-4 p-4 pb-24">
          <ProgressAnalytics />
          {/* <RewardsCard /> */}
          <StreaksGrid />
          <PhotoCarousel />
        </main>
      </div>

      <AddBottomSheet isOpen={showAddSheet} onClose={() => setShowAddSheet(false)} />
    </MainLayout>
  );
}
