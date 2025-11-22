// app/api/measurement-logs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getMeasurementLogs, createMeasurementLog } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const logs = await getMeasurementLogs(userId);
  
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
    
    if (!body.userId || !body.date || !body.measurements) {
      return NextResponse.json({ error: "userId, date, and measurements are required" }, { status: 400 });
    }

    const log = await createMeasurementLog({
      userId: body.userId,
      date: body.date,
      measurements: body.measurements,
    });

    // Serialize Date object
    const serializedLog = {
      ...log,
      createdAt: log.createdAt instanceof Date ? log.createdAt.toISOString() : log.createdAt,
    };

    return NextResponse.json(serializedLog, { status: 201 });
  } catch (error) {
    console.error("Error creating measurement log:", error);
    return NextResponse.json({ error: "Failed to create measurement log" }, { status: 500 });
  }
}

