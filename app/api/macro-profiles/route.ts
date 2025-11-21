// app/api/macro-profiles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getMacroProfile, createMacroProfile } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const profile = await getMacroProfile(userId);
  
  if (!profile) {
    return NextResponse.json({ error: "Macro profile not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profile = await createMacroProfile({
      userId: body.userId,
      dailyCalories: body.dailyCalories,
      proteinG: body.proteinG,
      carbsG: body.carbsG,
      fatsG: body.fatsG,
      source: body.source || "computed",
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error("Error creating macro profile:", error);
    return NextResponse.json({ error: "Failed to create macro profile" }, { status: 500 });
  }
}

