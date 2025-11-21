// lib/rewards.ts
// Reward distribution logic

import type { Reward, MacroLog, WeightLog, Streak } from "@/types";

export interface RewardEligibility {
  dailyMacros: boolean;
  dailyWeighin: boolean;
  weeklyGood: boolean;
  monthlyMilestone: boolean;
}

/**
 * Check if user is eligible for daily macros reward
 */
export function checkDailyMacrosEligibility(
  macroLog: MacroLog | null,
  targetMacros: { calories: number; protein: number; carbs: number; fats: number }
): boolean {
  if (!macroLog) return false;

  const proteinHit = macroLog.proteinG >= targetMacros.protein * 0.9; // 90% of target
  const caloriesHit =
    macroLog.calories >= targetMacros.calories * 0.9 &&
    macroLog.calories <= targetMacros.calories * 1.1; // Within 10% of target

  return proteinHit && caloriesHit;
}

/**
 * Check if user is eligible for daily weigh-in reward
 */
export function checkDailyWeighinEligibility(weightLog: WeightLog | null): boolean {
  return weightLog !== null;
}

/**
 * Check if user is eligible for weekly reward
 */
export function checkWeeklyGoodEligibility(
  macroLogs: MacroLog[],
  weightLogs: WeightLog[],
  targetMacros: { calories: number; protein: number; carbs: number; fats: number }
): boolean {
  if (macroLogs.length < 5 || weightLogs.length < 5) return false;

  const macroDaysHit = macroLogs.filter((log) =>
    checkDailyMacrosEligibility(log, targetMacros)
  ).length;

  return macroDaysHit >= 5 && weightLogs.length >= 5;
}

/**
 * Check if user is eligible for monthly milestone reward
 */
export function checkMonthlyMilestoneEligibility(
  goal: string,
  weightLogs: WeightLog[],
  targetWeightChange?: number
): boolean {
  if (weightLogs.length < 2) return false;

  const startWeight = weightLogs[0].weight;
  const endWeight = weightLogs[weightLogs.length - 1].weight;
  const change = endWeight - startWeight;
  const changePercent = (change / startWeight) * 100;

  switch (goal) {
    case "lose_weight":
      return changePercent <= -4; // Lost 4% or more
    case "gain_muscle":
      return change >= 2; // Gained 2kg or more
    case "recomposition":
      return Math.abs(changePercent) <= 2; // Maintained weight (recomposition)
    case "maintain":
      return Math.abs(changePercent) <= 2; // Maintained within 2%
    default:
      return false;
  }
}

/**
 * Calculate adherence score for challenges
 */
export function calculateAdherenceScore(
  macroLogs: MacroLog[],
  weightLogs: WeightLog[],
  challengeRules: {
    requiredMacroDaysPerWeek?: number;
    requiredActivityDaysPerWeek?: number;
    targetWeightLossPercent?: number;
  }
): number {
  let score = 0;

  // Macro adherence (40% weight)
  if (challengeRules.requiredMacroDaysPerWeek) {
    const macroDaysHit = macroLogs.filter((log) => log.hitTarget).length;
    const weeks = Math.ceil(macroLogs.length / 7);
    const targetDays = challengeRules.requiredMacroDaysPerWeek * weeks;
    const macroScore = Math.min((macroDaysHit / targetDays) * 100, 100);
    score += macroScore * 0.4;
  }

  // Weight logging consistency (20% weight)
  const weightScore = Math.min((weightLogs.length / (challengeRules.requiredMacroDaysPerWeek || 7)) * 100, 100);
  score += weightScore * 0.2;

  // Goal progress (40% weight)
  if (challengeRules.targetWeightLossPercent && weightLogs.length >= 2) {
    const startWeight = weightLogs[0].weight;
    const endWeight = weightLogs[weightLogs.length - 1].weight;
    const changePercent = ((endWeight - startWeight) / startWeight) * 100;
    const targetChange = -challengeRules.targetWeightLossPercent;
    
    if (changePercent <= targetChange) {
      score += 40; // Hit target
    } else {
      score += (changePercent / targetChange) * 40; // Partial progress
    }
  }

  return Math.min(score, 100);
}

/**
 * Distribute challenge rewards
 */
export function distributeChallengeRewards(
  participants: Array<{ userId: string; score: number }>,
  potSize: number
): Array<{ userId: string; amount: number }> {
  // Sort by score (descending)
  const sorted = [...participants].sort((a, b) => b.score - a.score);
  
  // Top 3 winners get 50%, 30%, 20%
  const shares = [0.5, 0.3, 0.2];
  const payouts: Array<{ userId: string; amount: number }> = [];

  sorted.slice(0, 3).forEach((participant, index) => {
    if (shares[index]) {
      payouts.push({
        userId: participant.userId,
        amount: potSize * shares[index],
      });
    }
  });

  return payouts;
}

