// app/api/diary-entries/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, createDiaryEntry, getDiaryEntries, deleteDiaryEntry } from "@/lib/db/schema";
import type { DiaryEntry } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const date = searchParams.get("date");
    const mealType = searchParams.get("mealType");

    // Return empty array if userId is missing or empty (user not connected)
    if (!userId || userId.trim() === "" || !date) {
      return NextResponse.json([]);
    }
    
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Invalid date format. Expected YYYY-MM-DD" }, { status: 400 });
    }

    console.log("GET /api/diary-entries:", { userId, date, mealType });
    
    // Log all entries in database for debugging
    console.log(`Total entries in database: ${db.diaryEntries.size}`);
    const allEntries = Array.from(db.diaryEntries.values());
    console.log("All entries in database:", allEntries.map(e => ({
      id: e.id,
      userId: e.userId,
      date: e.date,
      mealType: e.mealType,
      type: e.type
    })));
    
    const entries = await getDiaryEntries(userId, date, mealType as any);
    
    console.log(`Found ${entries.length} entries for userId=${userId}, date=${date}, mealType=${mealType || 'all'}`);

    // Enrich entries with food item data and serialize Date objects
    const enrichedEntries = entries.map((entry) => {
      const serializedEntry: any = {
        ...entry,
        createdAt: entry.createdAt instanceof Date ? entry.createdAt.toISOString() : entry.createdAt,
      };
      
      if (entry.foodItemId) {
        const foodItem = db.foodItems.get(entry.foodItemId);
        if (foodItem) {
          serializedEntry.foodItem = foodItem;
        }
      }
      
      return serializedEntry;
    });

    return NextResponse.json(enrichedEntries);
  } catch (error) {
    console.error("Error fetching diary entries:", error);
    return NextResponse.json({ error: "Failed to fetch diary entries" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("POST /api/diary-entries:", {
      userId: body.userId,
      date: body.date,
      mealType: body.mealType,
      type: body.type,
      foodItemId: body.foodItemId
    });
    
    // If foodItemData is provided, save the food item to database first
    if (body.foodItemData && body.foodItemId) {
      if (!db.foodItems.has(body.foodItemId)) {
        db.foodItems.set(body.foodItemId, body.foodItemData);
        console.log("Saved food item to database:", body.foodItemId);
      }
    }
    
    // Create diary entry (foodItemData is not part of DiaryEntry type)
    const { foodItemData, ...entryData } = body;
    const entry = await createDiaryEntry({
      userId: entryData.userId,
      date: entryData.date,
      mealType: entryData.mealType,
      type: entryData.type,
      foodItemId: entryData.foodItemId,
      mealId: entryData.mealId,
      recipeId: entryData.recipeId,
      quickCalories: entryData.quickCalories,
      quickProteinG: entryData.quickProteinG,
      quickCarbsG: entryData.quickCarbsG,
      quickFatsG: entryData.quickFatsG,
      quickName: entryData.quickName, // Store name for quick add entries
      quickInstructions: entryData.quickInstructions, // Store instructions for AI meals
      quantity: entryData.quantity || 1,
    });

    // Update macro log
    await updateMacroLogFromEntry(entry);

    // Return enriched entry with food item data and serialize Date objects
    const enrichedEntry: any = {
      ...entry,
      createdAt: entry.createdAt instanceof Date ? entry.createdAt.toISOString() : entry.createdAt,
    };
    
    if (entry.foodItemId && db.foodItems.has(entry.foodItemId)) {
      enrichedEntry.foodItem = db.foodItems.get(entry.foodItemId);
    }

    console.log("Created diary entry:", {
      id: enrichedEntry.id,
      userId: enrichedEntry.userId,
      date: enrichedEntry.date,
      mealType: enrichedEntry.mealType,
      type: enrichedEntry.type,
      foodItemId: enrichedEntry.foodItemId
    });

    return NextResponse.json(enrichedEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating diary entry:", error);
    return NextResponse.json({ error: "Failed to create diary entry" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await deleteDiaryEntry(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting diary entry:", error);
    return NextResponse.json({ error: "Failed to delete diary entry" }, { status: 500 });
  }
}

async function updateMacroLogFromEntry(entry: DiaryEntry) {
  // Get existing macro log
  const { getMacroLog, createOrUpdateMacroLog } = await import("@/lib/db/schema");
  const existingLog = await getMacroLog(entry.userId, entry.date);

  // Calculate macros from entry
  let calories = 0;
  let proteinG = 0;
  let carbsG = 0;
  let fatsG = 0;

  if (entry.type === "quick") {
    calories = (entry.quickCalories || 0) * (entry.quantity || 1);
    proteinG = (entry.quickProteinG || 0) * (entry.quantity || 1);
    carbsG = (entry.quickCarbsG || 0) * (entry.quantity || 1);
    fatsG = (entry.quickFatsG || 0) * (entry.quantity || 1);
  } else if (entry.foodItemId) {
    // Get food item from database
    const foodItem = db.foodItems.get(entry.foodItemId);
    if (foodItem) {
      const quantity = entry.quantity || 1;
      calories = foodItem.calories * quantity;
      proteinG = foodItem.proteinG * quantity;
      carbsG = foodItem.carbsG * quantity;
      fatsG = foodItem.fatsG * quantity;
    }
  }

  // Update or create macro log
  const newLog = {
    userId: entry.userId,
    date: entry.date,
    calories: (existingLog?.calories || 0) + calories,
    proteinG: (existingLog?.proteinG || 0) + proteinG,
    carbsG: (existingLog?.carbsG || 0) + carbsG,
    fatsG: (existingLog?.fatsG || 0) + fatsG,
    hitTarget: false, // TODO: Calculate based on user's macro profile
  };

  await createOrUpdateMacroLog(newLog);
}

