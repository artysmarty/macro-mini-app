// components/settings/edit-macros-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useMacroProfile, useUpdateMacroProfile } from "@/hooks/use-macro-profile";
import { useAuth } from "@/contexts/auth-context";

interface EditMacrosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to get consistent userId
function getUserId(fid: number | null | undefined): string {
  if (fid) {
    return `fid-${fid}`;
  }
  if (typeof window !== 'undefined') {
    let devUserId = localStorage.getItem('devUserId');
    if (!devUserId) {
      devUserId = `fid-dev-${Date.now()}`;
      localStorage.setItem('devUserId', devUserId);
    }
    return devUserId;
  }
  return `fid-dev-${Date.now()}`;
}

export function EditMacrosModal({ isOpen, onClose }: EditMacrosModalProps) {
  const { fid } = useAuth();
  const userId = getUserId(fid);
  const { data: macroProfile, isLoading } = useMacroProfile(userId);
  const updateMacroProfile = useUpdateMacroProfile();
  
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (macroProfile) {
      setCalories(macroProfile.dailyCalories.toString());
      setProtein(macroProfile.proteinG.toString());
      setCarbs(macroProfile.carbsG.toString());
      setFats(macroProfile.fatsG.toString());
    } else {
      // Default values if no profile exists
      setCalories("2400");
      setProtein("180");
      setCarbs("240");
      setFats("80");
    }
  }, [macroProfile]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const caloriesNum = parseFloat(calories);
    const proteinNum = parseFloat(protein);
    const carbsNum = parseFloat(carbs);
    const fatsNum = parseFloat(fats);

    if (!caloriesNum || !proteinNum || !carbsNum || !fatsNum) {
      alert("Please fill in all fields with valid numbers.");
      return;
    }

    if (caloriesNum <= 0 || proteinNum < 0 || carbsNum < 0 || fatsNum < 0) {
      alert("All values must be positive numbers.");
      return;
    }

    setIsSaving(true);
    try {
      await updateMacroProfile.mutateAsync({
        userId,
        dailyCalories: caloriesNum,
        proteinG: proteinNum,
        carbsG: carbsNum,
        fatsG: fatsNum,
        source: "manual",
      });
      onClose();
    } catch (error) {
      console.error("Error updating macros:", error);
      alert("Failed to update macros. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Edit Macros</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Daily Calories (kcal)
                </label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="2400"
                  min="0"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="180"
                  min="0"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="240"
                  min="0"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fats (g)
                </label>
                <input
                  type="number"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="80"
                  min="0"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

