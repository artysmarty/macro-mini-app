// components/library/food-library.tsx
"use client";

import { useState } from "react";
import { Search, Plus, Scan, FileText, Ruler, Scale, Camera } from "lucide-react";
import { FoodSearch } from "./food-search";
import { AddFoodForm } from "./add-food-form";
import { BarcodeScanner } from "./barcode-scanner";
import { QuickAddMacros } from "./quick-add-macros";
import { MeasurementsWizard } from "./measurements-wizard";
import { AddRecipeForm } from "./add-recipe-form";

type LibraryView = "grid" | "search" | "add-food" | "barcode" | "quick-add" | "measurements" | "add-recipe";

interface FoodLibraryProps {
  initialView?: string | null;
}

const actionItems = [
  { id: "add-food", label: "Add Food", icon: Plus, color: "bg-primary" },
  { id: "add-recipe", label: "Add Recipe", icon: FileText, color: "bg-info" },
  { id: "barcode", label: "Scan Barcode", icon: Scan, color: "bg-success" },
  { id: "quick-add", label: "Log Weight", icon: Scale, color: "bg-warning" },
  { id: "measurements", label: "Log Measurements", icon: Ruler, color: "bg-error" },
  { id: "photo", label: "Upload Progress Photo", icon: Camera, color: "bg-purple-500" },
] as const;

export function FoodLibrary({ initialView }: FoodLibraryProps) {
  const [view, setView] = useState<LibraryView>(() => {
    if (initialView === "quick-add") return "quick-add";
    if (initialView === "barcode") return "barcode";
    if (initialView === "measurements") return "measurements";
    if (initialView === "add-food") return "add-food";
    if (initialView === "add-recipe") return "add-recipe";
    return "grid";
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Show search results when typing
  const showSearch = searchQuery.trim().length > 0;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Search Bar - Always visible */}
      <div className="border-b border-gray-300 bg-white px-4 py-3 dark:border-dark-border dark:bg-dark-bg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search foods, recipes..."
            className="w-full rounded-xl border border-gray-300 bg-gray-100 px-10 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none dark:border-dark-border dark:bg-dark-card dark:text-dark-text dark:focus:border-primary"
          />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {showSearch || view !== "grid" ? (
          <div className="p-4">
            {view === "search" || showSearch ? (
              <FoodSearch query={searchQuery} />
            ) : (
              <>
                {view === "add-food" && <AddFoodForm onBack={() => setView("grid")} />}
                {view === "barcode" && <BarcodeScanner onBack={() => setView("grid")} />}
                {view === "quick-add" && <QuickAddMacros onBack={() => setView("grid")} />}
                {view === "measurements" && (
                  <MeasurementsWizard
                    onBack={() => setView("grid")}
                    onComplete={() => {
                      alert("Measurements saved successfully!");
                      setView("grid");
                    }}
                  />
                )}
                {view === "add-recipe" && <AddRecipeForm onBack={() => setView("grid")} />}
              </>
            )}
          </div>
        ) : (
          <div className="p-4">
            {/* Grid of Actions */}
            <div className="grid grid-cols-2 gap-3">
              {actionItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === "photo") {
                        // TODO: Open photo upload
                        alert("Photo upload coming soon!");
                      } else {
                        setView(item.id as LibraryView);
                      }
                    }}
                    className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white p-6 text-center shadow-card transition-colors hover:bg-gray-50 dark:border-dark-border dark:bg-dark-card dark:hover:bg-dark-hover dark:shadow-card-dark"
                  >
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${item.color} text-white`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-dark-text">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
