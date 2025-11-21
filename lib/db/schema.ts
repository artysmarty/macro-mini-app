// lib/db/schema.ts
// Database schema definitions
// In production, this would be used with Prisma, Drizzle, or similar ORM

import type {
  User,
  MacroProfile,
  MacroLog,
  FoodItem,
  Meal,
  Recipe,
  DiaryEntry,
  WeightLog,
  MeasurementLog,
  ProgressPhoto,
  Challenge,
  ChallengeParticipant,
  Reward,
  Streak,
} from "@/types";

// In-memory database for MVP (replace with real database in production)
export const db = {
  users: new Map<string, User>(),
  macroProfiles: new Map<string, MacroProfile>(),
  macroLogs: new Map<string, MacroLog>(),
  foodItems: new Map<string, FoodItem>(),
  meals: new Map<string, Meal>(),
  recipes: new Map<string, Recipe>(),
  diaryEntries: new Map<string, DiaryEntry>(),
  weightLogs: new Map<string, WeightLog>(),
  measurementLogs: new Map<string, MeasurementLog>(),
  progressPhotos: new Map<string, ProgressPhoto>(),
  challenges: new Map<string, Challenge>(),
  challengeParticipants: new Map<string, ChallengeParticipant>(),
  rewards: new Map<string, Reward>(),
  streaks: new Map<string, Streak>(),
};

// Helper functions for database operations
export async function getUserByWallet(walletAddress: string): Promise<User | null> {
  for (const user of db.users.values()) {
    if (user.walletAddress.toLowerCase() === walletAddress.toLowerCase()) {
      return user;
    }
  }
  return null;
}

export async function createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
  const id = crypto.randomUUID();
  const now = new Date();
  const newUser: User = {
    ...user,
    id,
    createdAt: now,
    updatedAt: now,
  };
  db.users.set(id, newUser);
  return newUser;
}

export async function getMacroProfile(userId: string): Promise<MacroProfile | null> {
  for (const profile of db.macroProfiles.values()) {
    if (profile.userId === userId) {
      return profile;
    }
  }
  return null;
}

export async function createMacroProfile(profile: Omit<MacroProfile, "createdAt" | "updatedAt">): Promise<MacroProfile> {
  const now = new Date();
  const newProfile: MacroProfile = {
    ...profile,
    createdAt: now,
    updatedAt: now,
  };
  db.macroProfiles.set(profile.userId, newProfile);
  return newProfile;
}

export async function getMacroLog(userId: string, date: string): Promise<MacroLog | null> {
  const key = `${userId}-${date}`;
  return db.macroLogs.get(key) || null;
}

export async function createOrUpdateMacroLog(log: MacroLog): Promise<MacroLog> {
  const key = `${log.userId}-${log.date}`;
  db.macroLogs.set(key, log);
  return log;
}

// Export all helper functions
export const dbHelpers = {
  getUserByWallet,
  createUser,
  getMacroProfile,
  createMacroProfile,
  getMacroLog,
  createOrUpdateMacroLog,
};

