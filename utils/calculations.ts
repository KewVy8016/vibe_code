import { Gender, ActivityLevel, Goal, UserProfile } from '../types';

export const calculateBMR = (user: UserProfile): number => {
  // Mifflin-St Jeor Equation
  const s = user.gender === Gender.MALE ? 5 : -161;
  return 10 * user.weight + 6.25 * user.height - 5 * user.age + s;
};

export const calculateTDEE = (bmr: number, activity: ActivityLevel): number => {
  switch (activity) {
    case ActivityLevel.SEDENTARY: return bmr * 1.2;
    case ActivityLevel.LIGHT: return bmr * 1.375;
    case ActivityLevel.MODERATE: return bmr * 1.55;
    case ActivityLevel.ACTIVE: return bmr * 1.725;
    case ActivityLevel.VERY_ACTIVE: return bmr * 1.9;
    default: return bmr * 1.2;
  }
};

export const calculateTargetCalories = (tdee: number, goal: Goal): number => {
  switch (goal) {
    case Goal.LOSE: return Math.round(tdee - 500); // 500 deficit
    case Goal.GAIN: return Math.round(tdee + 300); // 300 surplus
    case Goal.MAINTAIN: return Math.round(tdee);
    default: return Math.round(tdee);
  }
};