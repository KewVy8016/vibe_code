import React, { useState } from 'react';
import { UserProfile, DailyPlan } from './types';
import OnboardingForm from './components/OnboardingForm';
import MealCard from './components/MealCard';
import MacroChart from './components/MacroChart';
import { generateMealPlan } from './services/geminiService';
import { RefreshCw, ChefHat, Info, ArrowLeft, Leaf } from 'lucide-react';

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [calculatedCalories, setCalculatedCalories] = useState<number>(0);
  const [mealPlan, setMealPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (profile: UserProfile, calories: number) => {
    setUserProfile(profile);
    setCalculatedCalories(calories);
    setLoading(true);
    setError(null);
    try {
      const plan = await generateMealPlan(profile, calories);
      setMealPlan(plan);
    } catch (err: any) {
      setError(err.message || "Something went wrong generating the plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (userProfile && calculatedCalories) {
      handleGenerate(userProfile, calculatedCalories);
    }
  };

  const handleReset = () => {
    setUserProfile(null);
    setMealPlan(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-emerald-700">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <Leaf size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">FitMealAI</h1>
          </div>
          {userProfile && (
             <button onClick={handleReset} className="text-sm font-medium text-slate-500 hover:text-emerald-600 flex items-center">
               <ArrowLeft size={16} className="mr-1" /> New Profile
             </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
              <button 
                onClick={handleRegenerate}
                className="mt-2 text-sm underline hover:text-red-800"
              >
                Try Again
              </button>
            </div>
          )}

          {!mealPlan && !loading && (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="text-center mb-10 max-w-2xl">
                 <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
                  Eat smarter, not less.
                </h2>
                <p className="text-lg text-slate-600">
                  Get a personalized AI-powered meal plan tailored to your body type and fitness goals in seconds.
                </p>
              </div>
              <OnboardingForm onComplete={handleGenerate} isLoading={loading} />
            </div>
          )}

          {loading && !mealPlan && (
             <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="relative w-24 h-24">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                  <ChefHat className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-emerald-600 w-10 h-10" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-800">Chef Gemini is thinking...</h3>
                  <p className="text-slate-500 mt-2">Balancing your macros and ingredients</p>
                </div>
             </div>
          )}

          {mealPlan && (
            <div className="animate-fadeIn">
              
              {/* Dashboard Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Left: Stats & Controls */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                      <Info size={18} className="mr-2 text-emerald-500" /> Daily Target
                    </h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Goal</span>
                        <span className="font-semibold text-emerald-700 text-right">{userProfile?.goal}</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Target Calories</span>
                        <span className="font-semibold text-slate-800">{calculatedCalories} kcal</span>
                      </div>
                      <div className="pt-2">
                         <MacroChart macros={mealPlan.totalMacros} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                    <h3 className="font-bold text-emerald-900 mb-2">Chef's Tips</h3>
                    <ul className="space-y-2">
                      {mealPlan.tips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-emerald-800 flex items-start">
                          <span className="mr-2">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    onClick={handleRegenerate}
                    disabled={loading}
                    className="w-full py-3 bg-white border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-600 font-bold rounded-xl transition-all flex items-center justify-center shadow-sm"
                  >
                     <RefreshCw className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} /> 
                     {loading ? 'Regenerating...' : 'Regenerate Plan'}
                  </button>
                </div>

                {/* Right: Meal Plan List */}
                <div className="lg:col-span-2">
                   <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white mb-6 shadow-lg">
                      <h2 className="text-2xl font-bold mb-1">Today's Plan</h2>
                      <p className="opacity-90 font-light text-lg">"{mealPlan.daySummary}"</p>
                   </div>

                   <div className="space-y-4">
                      {mealPlan.meals.map((meal, index) => (
                        <MealCard key={index} meal={meal} />
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} FitMealAI. Powered by Google Gemini.</p>
        <p className="mt-1 text-xs">Consult a medical professional before starting any diet.</p>
      </footer>
    </div>
  );
}

export default App;