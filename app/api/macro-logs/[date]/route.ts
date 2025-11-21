// app/api/macro-logs/[date]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getMacroLog, createOrUpdateMacroLog } from "@/lib/db/schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const log = await getMacroLog(userId, date);
  
  if (!log) {
    // Return empty log if not found
    return NextResponse.json({
      userId,
      date,
      calories: 0,
      proteinG: 0,
      carbsG: 0,
      fatsG: 0,
      hitTarget: false,
    });
  }

  return NextResponse.json(log);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params;
    const body = await request.json();

    const log = await createOrUpdateMacroLog({
      userId: body.userId,
      date,
      calories: body.calories || 0,
      proteinG: body.proteinG || 0,
      carbsG: body.carbsG || 0,
      fatsG: body.fatsG || 0,
      hitTarget: body.hitTarget || false,
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("Error saving macro log:", error);
    return NextResponse.json({ error: "Failed to save macro log" }, { status: 500 });
  }
}

