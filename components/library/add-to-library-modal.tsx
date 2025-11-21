// components/library/add-to-library-modal.tsx
"use client";

import { useState, useRef } from "react";
import { X, Check } from "lucide-react";
import { BottomSheet } from "@/components/common/bottom-sheet";
import { AddFoodFormComprehensive } from "./add-food-form-comprehensive";
import { AddRecipeFormComprehensive } from "./add-recipe-form-comprehensive";

interface AddToLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type ViewType = "choice" | "food" | "recipe";

export function AddToLibraryModal({ isOpen, onClose, onSuccess }: AddToLibraryModalProps) {
  const [view, setView] = useState<ViewType>("choice");
  const [showSaveButton, setShowSaveButton] = useState(false);
  const saveFormRef = useRef<() => void>(null);

  const handleChoice = (type: "food" | "recipe") => {
    setView(type);
    setShowSaveButton(false);
  };

  const handleBack = () => {
    setView("choice");
    setShowSaveButton(false);
  };

  const handleSave = () => {
    // Call the child form's save function
    if (saveFormRef.current) {
      saveFormRef.current();
      onSuccess?.();
      handleClose();
    }
  };

  const handleClose = () => {
    setView("choice");
    setShowSaveButton(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Save Button (Checkmark) - Fixed Top Right */}
      {view !== "choice" && showSaveButton && (
        <button
          onClick={handleSave}
          className="fixed top-20 right-4 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-xl transition-colors hover:bg-primary-hover"
        >
          <Check className="h-6 w-6" />
        </button>
      )}
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title={
          view === "choice" ? "Add to Library" : view === "food" ? "Add Food" : "Add Recipe"
        }
      >
        <div className="relative">

        {view === "choice" && (
          <div className="space-y-3">
            <button
              onClick={() => handleChoice("food")}
              className="flex w-full items-center justify-center rounded-xl border-2 border-gray-300 bg-white px-6 py-8 text-lg font-medium transition-colors hover:border-primary hover:bg-gray-50 dark:border-dark-border dark:bg-dark-card dark:hover:border-primary"
            >
              Food
            </button>
            <button
              onClick={() => handleChoice("recipe")}
              className="flex w-full items-center justify-center rounded-xl border-2 border-gray-300 bg-white px-6 py-8 text-lg font-medium transition-colors hover:border-primary hover:bg-gray-50 dark:border-dark-border dark:bg-dark-card dark:hover:border-primary"
            >
              Recipe
            </button>
          </div>
        )}

        {view === "food" && (
          <AddFoodFormComprehensive
            onBack={handleBack}
            onSaveRef={(saveFn) => (saveFormRef.current = saveFn)}
            onFormChange={(isValid) => setShowSaveButton(isValid)}
          />
        )}

        {view === "recipe" && (
          <AddRecipeFormComprehensive
            onBack={handleBack}
            onSaveRef={(saveFn) => (saveFormRef.current = saveFn)}
            onFormChange={(isValid) => setShowSaveButton(isValid)}
          />
        )}
      </div>
    </BottomSheet>
    </>
  );
}

