// lib/macro-calculator.ts
import type { User } from "@/types";

export interface MacroTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
}

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
 */
function calculateBMR(weight: number, height: number, age: number, gender: "male" | "female" | "other"): number {
  // BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + s
  // s = +5 for males, -161 for females, average for other
  let s: number;
  if (gender === "male") {
    s = 5;
  } else if (gender === "female") {
    s = -161;
  } else {
    // For "other", use average between male and female
    s = -78; // Average of 5 and -161
  }
  return 10 * weight + 6.25 * height - 5 * age + s;
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 */
function calculateTDEE(bmr: number, activityLevel: User["activityLevel"]): number {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    high: 1.725,
  };

  const multiplier = multipliers[activityLevel || "sedentary"];
  return bmr * multiplier;
}

/**
 * Calculate macro targets based on user profile and goal
 */
export function calculateMacros(user: User): MacroTargets {
  if (!user.weight || !user.height || !user.age || !user.gender || !user.goal) {
    throw new Error("Missing required user data for macro calculation");
  }

  const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
  let tdee = calculateTDEE(bmr, user.activityLevel);

  // Apply goal-based adjustments
  let calorieTarget = tdee;
  switch (user.goal) {
    case "lose_weight":
      calorieTarget = tdee * 0.8; // 20% deficit
      break;
    case "gain_muscle":
      calorieTarget = tdee * 1.1; // 10% surplus
      break;
    case "recomposition":
      calorieTarget = tdee * 0.95; // 5% deficit
      break;
    case "maintain":
      calorieTarget = tdee;
      break;
  }

  // Calculate macros (standard split for general fitness)
  // Protein: 2.2g per kg body weight (or 25-30% of calories)
  const proteinG = Math.max(user.weight * 2.2, (calorieTarget * 0.25) / 4);

  // Fats: 25-30% of calories (1g fat = 9 calories)
  const fatsG = (calorieTarget * 0.27) / 9;

  // Carbs: Remaining calories
  const remainingCalories = calorieTarget - (proteinG * 4) - (fatsG * 9);
  const carbsG = remainingCalories / 4;

  return {
    calories: Math.round(calorieTarget),
    proteinG: Math.round(proteinG),
    carbsG: Math.round(carbsG),
    fatsG: Math.round(fatsG),
  };
}

