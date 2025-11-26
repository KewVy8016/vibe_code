export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum ActivityLevel {
  SEDENTARY = 'Sedentary (little or no exercise)',
  LIGHT = 'Lightly active (1-3 days/week)',
  MODERATE = 'Moderately active (3-5 days/week)',
  ACTIVE = 'Active (6-7 days/week)',
  VERY_ACTIVE = 'Very active (physical job or 2x training)',
}

export enum Goal {
  LOSE = 'Lose Weight',
  MAINTAIN = 'Maintain Weight',
  GAIN = 'Build Muscle',
}

export interface UserProfile {
  age: number;
  gender: Gender;
  height: number; // cm
  weight: number; // kg
  activityLevel: ActivityLevel;
  goal: Goal;
  dietaryRestrictions: string;
  targetCalories?: number;
}

export interface MacroNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Meal {
  name: string;
  description: string;
  macros: MacroNutrients;
  ingredients: string[];
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

export interface DailyPlan {
  daySummary: string;
  totalMacros: MacroNutrients;
  meals: Meal[];
  tips: string[];
}