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
    if (user.walletAddress?.toLowerCase() === walletAddress.toLowerCase()) {
      return user;
    }
  }
  return null;
}

export async function getUserByFid(fid: number): Promise<User | null> {
  for (const user of db.users.values()) {
    if (user.fid === fid) {
      return user;
    }
  }
  return null;
}

export async function getUserById(userId: string): Promise<User | null> {
  return db.users.get(userId) || null;
}

export async function updateUser(userId: string, updates: Partial<Omit<User, "id" | "createdAt">>): Promise<User> {
  const user = db.users.get(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const updatedUser: User = {
    ...user,
    ...updates,
    updatedAt: new Date(),
  };
  db.users.set(userId, updatedUser);
  return updatedUser;
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
  // Check if profile already exists - if so, update it
  const existing = await getMacroProfile(profile.userId);
  const newProfile: MacroProfile = {
    ...profile,
    createdAt: existing?.createdAt || now,
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

export async function getDiaryEntries(
  userId: string,
  date: string,
  mealType?: "breakfast" | "lunch" | "dinner" | "snacks"
): Promise<DiaryEntry[]> {
  const entries: DiaryEntry[] = [];
  console.log(`getDiaryEntries called: userId=${userId}, date=${date}, mealType=${mealType || 'all'}`);
  console.log(`Total entries in DB: ${db.diaryEntries.size}`);
  
  for (const entry of db.diaryEntries.values()) {
    console.log(`Checking entry: id=${entry.id}, userId=${entry.userId}, date=${entry.date}, mealType=${entry.mealType}`);
    if (entry.userId === userId && entry.date === date) {
      if (!mealType || entry.mealType === mealType) {
        entries.push(entry);
      }
    }
  }
  
  console.log(`Found ${entries.length} matching entries`);
  return entries.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

export async function createDiaryEntry(
  entry: Omit<DiaryEntry, "id" | "createdAt">
): Promise<DiaryEntry> {
  const id = crypto.randomUUID();
  const now = new Date();
  const newEntry: DiaryEntry = {
    ...entry,
    id,
    createdAt: now,
  };
  db.diaryEntries.set(id, newEntry);
  return newEntry;
}

export async function deleteDiaryEntry(id: string): Promise<void> {
  db.diaryEntries.delete(id);
}

// Export all helper functions
export const dbHelpers = {
  getUserByWallet,
  createUser,
  getMacroProfile,
  createMacroProfile,
  getMacroLog,
  createOrUpdateMacroLog,
  getDiaryEntries,
  createDiaryEntry,
  deleteDiaryEntry,
};

