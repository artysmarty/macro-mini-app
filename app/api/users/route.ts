// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserByWallet, createUser } from "@/lib/db/schema";
import type { User } from "@/types";

export async function GET(request: NextRequest) {
  const walletAddress = request.nextUrl.searchParams.get("walletAddress");
  
  if (!walletAddress) {
    return NextResponse.json({ error: "walletAddress is required" }, { status: 400 });
  }

  const user = await getUserByWallet(walletAddress);
  
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await createUser({
      walletAddress: body.walletAddress,
      displayName: body.displayName,
      avatar: body.avatar,
      age: body.age,
      height: body.height,
      weight: body.weight,
      gender: body.gender,
      goal: body.goal,
      activityLevel: body.activityLevel,
      bodyMeasurements: body.bodyMeasurements,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

