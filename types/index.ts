// types/index.ts
export interface User {
  id: string;
  walletAddress?: string; // Optional for Farcaster users
  fid?: number; // Farcaster ID
  displayName?: string;
  avatar?: string;
  age?: number;
  height?: number; // cm
  weight?: number; // kg
  gender?: "male" | "female" | "other";
  goal?: "lose_weight" | "gain_muscle" | "recomposition" | "maintain";
  activityLevel?: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active";
  bodyMeasurements?: BodyMeasurements;
  onboardingCompleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BodyMeasurements {
  waist?: number; // cm
  chest?: number; // cm
  hips?: number; // cm
  arms?: number; // cm
  thighs?: number; // cm
}

export interface MacroProfile {
  userId: string;
  dailyCalories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  source: "computed" | "manual";
  createdAt: Date;
  updatedAt: Date;
}

export interface MacroLog {
  userId: string;
  date: string; // YYYY-MM-DD
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  fiberG?: number;
  sodiumMg?: number;
  sugarG?: number;
  hitTarget: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  servingSize: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  fiberG?: number;
  sodiumMg?: number;
  sugarG?: number;
  barcode?: string;
  createdByUserId?: string;
  isPublic: boolean;
  category?: "foods" | "meals" | "recipes";
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  foodItems: MealItem[];
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatsG: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MealItem {
  foodItemId: string;
  quantity: number; // multiplier for serving size
}

export interface Recipe {
  id: string;
  userId: string;
  name: string;
  instructions: string;
  servings: number;
  ingredients: RecipeIngredient[];
  perServingCalories: number;
  perServingProteinG: number;
  perServingCarbsG: number;
  perServingFatsG: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeIngredient {
  foodItemId: string;
  quantity: number;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mealType: "breakfast" | "lunch" | "dinner" | "snacks";
  type: "food" | "meal" | "recipe" | "quick";
  foodItemId?: string;
  mealId?: string;
  recipeId?: string;
  quickCalories?: number;
  quickProteinG?: number;
  quickCarbsG?: number;
  quickFatsG?: number;
  quickName?: string; // Name for quick add entries (e.g., "Bread")
  quickInstructions?: string; // Recipe instructions for AI meals
  quantity?: number;
  createdAt: Date;
}

export interface WeightLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  weight: number; // kg
  source: "manual" | "apple_health" | "google_fit" | "garmin" | "fitbit" | "nfc_scale";
  createdAt: Date;
}

export interface MeasurementLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  measurements: BodyMeasurements;
  createdAt: Date;
}

export interface ProgressPhoto {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  type: "front" | "side" | "back";
  storageUrl: string;
  createdAt: Date;
}

export interface Avatar {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  modelMetadata: Record<string, unknown>;
  storageUrl: string;
  createdAt: Date;
}

export interface Challenge {
  id: string;
  creatorUserId: string;
  name: string;
  description: string;
  durationWeeks: number;
  goalType: "weight_loss_percent" | "macro_adherence_days" | "activity_based";
  entryStakeAmount: string; // token amount as string
  entryStakeToken: "project_token" | "usdc";
  rules: ChallengeRules;
  startDate: Date;
  endDate: Date;
  maxParticipants?: number;
  minParticipants?: number;
  potSize: string;
  status: "draft" | "open" | "active" | "ended" | "payout_complete";
  createdAt: Date;
  updatedAt: Date;
}

export interface ChallengeRules {
  targetWeightLossPercent?: number;
  requiredMacroDaysPerWeek?: number;
  requiredActivityDaysPerWeek?: number;
  activityTypes?: string[];
}

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  stakeTxHash: string;
  baselineWeight?: number;
  baselineMeasurements?: BodyMeasurements;
  baselinePhotos?: string[];
  joinedAt: Date;
}

export interface ChallengeScore {
  challengeId: string;
  userId: string;
  adherenceScore: number;
  rank?: number;
  computedAt: Date;
}

export interface Reward {
  id: string;
  userId: string;
  type: "daily_macros" | "daily_weighin" | "weekly_good" | "monthly_milestone" | "challenge";
  amount: string; // token amount
  txHash?: string;
  challengeId?: string;
  createdAt: Date;
}

export interface Streak {
  userId: string;
  category: "macros" | "weighins";
  currentLength: number;
  longestLength: number;
  lastActivityDate: string; // YYYY-MM-DD
}

export interface ProgressNFT {
  tokenId: string;
  userId: string;
  challengeId?: string;
  metadata: {
    goalType: string;
    outcomeStats: Record<string, unknown>;
    timeframe: string;
  };
  mintedAt: Date;
}

