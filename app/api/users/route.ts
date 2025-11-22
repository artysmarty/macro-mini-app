// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserByWallet, createUser } from "@/lib/db/schema";
import type { User } from "@/types";

export async function GET(request: NextRequest) {
  const walletAddress = request.nextUrl.searchParams.get("walletAddress");
  const fid = request.nextUrl.searchParams.get("fid");
  const userId = request.nextUrl.searchParams.get("userId");
  
  let user: User | null = null;
  
  if (userId) {
    const { getUserById } = await import("@/lib/db/schema");
    user = await getUserById(userId);
  } else if (fid) {
    user = await getUserByFid(parseInt(fid));
  } else if (walletAddress) {
    user = await getUserByWallet(walletAddress);
  } else {
    return NextResponse.json({ error: "walletAddress, fid, or userId is required" }, { status: 400 });
  }
  
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
      fid: body.fid,
      displayName: body.displayName,
      avatar: body.avatar,
      age: body.age,
      height: body.height,
      weight: body.weight,
      gender: body.gender,
      goal: body.goal,
      activityLevel: body.activityLevel,
      bodyMeasurements: body.bodyMeasurements,
      onboardingCompleted: body.onboardingCompleted || false,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json({ error: "User id is required" }, { status: 400 });
    }

    const user = await updateUser(body.id, {
      walletAddress: body.walletAddress,
      fid: body.fid,
      displayName: body.displayName,
      avatar: body.avatar,
      age: body.age,
      height: body.height,
      weight: body.weight,
      gender: body.gender,
      goal: body.goal,
      activityLevel: body.activityLevel,
      bodyMeasurements: body.bodyMeasurements,
      onboardingCompleted: body.onboardingCompleted,
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

