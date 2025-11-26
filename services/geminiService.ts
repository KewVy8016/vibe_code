import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, DailyPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMealPlan = async (user: UserProfile, calculatedCalories: number): Promise<DailyPlan> => {
  
  const model = 'gemini-2.5-flash';

  const schema = {
    type: Type.OBJECT,
    properties: {
      daySummary: { type: Type.STRING, description: "A one sentence enthusiastic summary of today's nutrition focus." },
      totalMacros: {
        type: Type.OBJECT,
        properties: {
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fats: { type: Type.NUMBER },
        },
        required: ["calories", "protein", "carbs", "fats"],
      },
      meals: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["Breakfast", "Lunch", "Dinner", "Snack"] },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            macros: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fats: { type: Type.NUMBER },
              },
              required: ["calories", "protein", "carbs", "fats"],
            }
          },
          required: ["name", "description", "type", "ingredients", "macros"]
        }
      },
      tips: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["daySummary", "totalMacros", "meals", "tips"]
  };

  const prompt = `
    Generate a 1-day meal plan for a person with the following profile:
    - Goal: ${user.goal}
    - Daily Calorie Target: ${calculatedCalories} kcal
    - Dietary Restrictions/Preferences: ${user.dietaryRestrictions || "None"}
    
    The plan must include Breakfast, Lunch, Dinner, and at least one Snack.
    Ensure the total calories are within +/- 5% of the target ${calculatedCalories}.
    Focus on healthy, whole foods appropriate for the goal.
    For 'Build Muscle', focus on high protein.
    For 'Lose Weight', focus on volume and fiber.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as DailyPlan;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate meal plan. Please try again.");
  }
};