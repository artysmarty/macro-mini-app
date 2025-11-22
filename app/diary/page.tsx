// app/diary/page.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MainLayout } from "@/components/layout/main-layout";
import { AppBar } from "@/components/layout/app-bar";
import { MacroSummaryBar } from "@/components/dashboard/macro-summary-bar";
import { DiaryDatePicker } from "@/components/diary/diary-date-picker";
import { MealSection } from "@/components/diary/meal-section";
import { AddFoodMenu } from "@/components/diary/add-food-menu";
import { ShareDayModal } from "@/components/diary/share-day-modal";
import { useCreateDiaryEntry } from "@/hooks/use-diary-entries";
import { useAuth } from "@/contexts/auth-context";
import type { FoodItem } from "@/types";

const mealTypes = ["breakfast", "lunch", "dinner", "snacks"] as const;

export default function DiaryPage() {
  const { fid } = useAuth();
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showShareDay, setShowShareDay] = useState(false);
  const [activeMealType, setActiveMealType] = useState<"breakfast" | "lunch" | "dinner" | "snacks" | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const createEntry = useCreateDiaryEntry();
  
  // Use consistent userId - if no fid, use a stable dev userId instead of generating a new one each time
  const getUserId = () => {
    if (fid) {
      return `fid-${fid}`;
    }
    // Use localStorage to persist dev userId across page refreshes
    if (typeof window !== 'undefined') {
      let devUserId = localStorage.getItem('devUserId');
      if (!devUserId) {
        devUserId = `fid-dev-${Date.now()}`;
        localStorage.setItem('devUserId', devUserId);
      }
      return devUserId;
    }
    return `fid-dev-${Date.now()}`;
  };

  const handleAddFood = async (food: FoodItem | FoodItem[], mealTypeOverride?: "breakfast" | "lunch" | "dinner" | "snacks" | null, quantityOverride?: number) => {
    // Use mealTypeOverride if provided, otherwise use activeMealType
    const targetMealType = mealTypeOverride !== undefined ? mealTypeOverride : activeMealType;
    
    // Use consistent userId function
    const userId = getUserId();
    
    if (!targetMealType) {
      console.error("Meal type not selected", {
        fid,
        activeMealType,
        mealTypeOverride,
        targetMealType
      });
      alert("Please select a meal section first.");
      return;
    }
    
    console.log("Adding food to diary:", {
      fid,
      userId,
      targetMealType,
      food
    });

    const date = format(selectedDate, "yyyy-MM-dd");
    // userId is already set above (either from fid or dev mock)
    const foods = Array.isArray(food) ? food : [food];

    try {
      for (const item of foods) {
        // Check if it's a meal (from AI suggestions) or quick add
        if (item.category === "meals" || item.id.startsWith("quick-") || item.id.startsWith("ai-meal-")) {
          // For meals/quick add, create a quick entry with the macros
          // Store the name and instructions if available
          // Use quantityOverride if provided (from FoodDetailSheet), otherwise default to 1
          const entryPayload: any = {
            userId,
            date,
            mealType: targetMealType,
            type: "quick",
            quickCalories: item.calories || 0,
            quickProteinG: item.proteinG || 0,
            quickCarbsG: item.carbsG || 0,
            quickFatsG: item.fatsG || 0,
            quickName: item.name || "Quick Add", // Store the actual name
            quantity: quantityOverride ?? 1,
          };
          
          // Store instructions if this is an AI meal (from MealSuggestion)
          if ((item as any).instructions) {
            entryPayload.quickInstructions = (item as any).instructions;
          }
          
          await createEntry.mutateAsync(entryPayload);
        } else {
          // For food items (from library, barcode, or demo)
          let foodItemId = item.id;
          
          // Generate stable ID for new items (barcode or demo)
          if (item.id.startsWith("barcode-") || item.id.startsWith("demo-")) {
            foodItemId = item.barcode ? `food-${item.barcode}` : `food-${Date.now()}-${item.name.replace(/\s+/g, "-").toLowerCase()}`;
          }
          
          // Always send food item data so API can save it if it doesn't exist
          // This ensures library foods are saved to the database
          const foodItemData = {
            ...item,
            id: foodItemId,
            createdByUserId: userId,
            isPublic: item.isPublic !== undefined ? item.isPublic : true,
          };
          
          // Create diary entry with food item data
          // Use quantityOverride if provided (from FoodDetailSheet), otherwise default to 1
          const entryPayload: any = {
            userId,
            date,
            mealType: targetMealType,
            type: "food",
            foodItemId: foodItemId,
            quantity: quantityOverride ?? 1,
            foodItemData: foodItemData, // Always include food item data
          };
          
          console.log("About to create diary entry:", {
            userId,
            date,
            mealType: targetMealType,
            foodItemId,
            entryPayload
          });
          
          const createdEntry = await createEntry.mutateAsync(entryPayload);
          console.log("Entry created successfully:", createdEntry);
        }
      }
      
      setShowAddSheet(false);
      setActiveMealType(null);
    } catch (error) {
      console.error("Error adding food to diary:", error);
      alert("Failed to add food to diary. Please try again.");
    }
  };

  return (
    <MainLayout>
      <div className="flex min-h-screen flex-col">
        <AppBar 
          title={<DiaryDatePicker onDateChange={setSelectedDate} />} 
          rightAction="overflow"
          onRightActionClick={() => setShowShareDay(true)}
        />
        <MacroSummaryBar date={selectedDate} />
        
        <main className="flex-1 space-y-3 p-4 pb-24">
          {mealTypes.map((mealType) => (
            <MealSection 
              key={mealType} 
              mealType={mealType}
              selectedDate={selectedDate}
              onAddClick={() => {
                console.log("Meal section Add clicked:", mealType);
                setActiveMealType(mealType);
                setShowAddSheet(true);
              }} 
            />
          ))}
        </main>
      </div>

      <AddFoodMenu 
        isOpen={showAddSheet} 
        onClose={() => {
          console.log("AddFoodMenu onClose called, activeMealType was:", activeMealType);
          setShowAddSheet(false);
          setActiveMealType(null);
        }}
        mealType={activeMealType}
        onAddFood={handleAddFood}
      />
      
      <ShareDayModal 
        isOpen={showShareDay} 
        onClose={() => setShowShareDay(false)} 
      />
    </MainLayout>
  );
}
