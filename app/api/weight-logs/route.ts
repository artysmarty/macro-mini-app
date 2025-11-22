// app/api/weight-logs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getWeightLogs, createWeightLog } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const logs = await getWeightLogs(userId);
  
  // Serialize Date objects to ISO strings
  const serializedLogs = logs.map(log => ({
    ...log,
    createdAt: log.createdAt instanceof Date ? log.createdAt.toISOString() : log.createdAt,
  }));

  return NextResponse.json(serializedLogs);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.userId || !body.date || body.weight === undefined) {
      return NextResponse.json({ error: "userId, date, and weight are required" }, { status: 400 });
    }

    const log = await createWeightLog({
      userId: body.userId,
      date: body.date,
      weight: body.weight,
      source: body.source || "manual",
    });

    // Serialize Date object
    const serializedLog = {
      ...log,
      createdAt: log.createdAt instanceof Date ? log.createdAt.toISOString() : log.createdAt,
    };

    return NextResponse.json(serializedLog, { status: 201 });
  } catch (error) {
    console.error("Error creating weight log:", error);
    return NextResponse.json({ error: "Failed to create weight log" }, { status: 500 });
  }
}

