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
 * Activity multipliers:
 * - Sedentary: 1.2 (little or no exercise)
 * - Lightly Active: 1.375 (light exercise 1–3 days/week)
 * - Moderately Active: 1.55 (moderate exercise 3–5 days/week)
 * - Very Active: 1.725 (hard exercise 6–7 days/week)
 * - Extremely Active: 1.9 (hard daily exercise/physical job)
 */
function calculateTDEE(bmr: number, activityLevel: User["activityLevel"]): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  };

  const multiplier = multipliers[activityLevel || "sedentary"] || 1.2;
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

  // Calculate macros using 40% carbs, 30% protein, 30% fat split
  // Protein: 30% of calories (4 calories per gram)
  const proteinG = (calorieTarget * 0.30) / 4;

  // Carbs: 40% of calories (4 calories per gram)
  const carbsG = (calorieTarget * 0.40) / 4;

  // Fats: 30% of calories (9 calories per gram)
  const fatsG = (calorieTarget * 0.30) / 9;

  return {
    calories: Math.round(calorieTarget),
    proteinG: Math.round(proteinG),
    carbsG: Math.round(carbsG),
    fatsG: Math.round(fatsG),
  };
}

