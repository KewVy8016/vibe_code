import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, Goal } from '../types';
import { Calculator, ChevronRight, Activity, Target, User } from 'lucide-react';
import { calculateBMR, calculateTDEE, calculateTargetCalories } from '../utils/calculations';

interface OnboardingFormProps {
  onComplete: (profile: UserProfile, calculatedCalories: number) => void;
  isLoading: boolean;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete, isLoading }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    gender: Gender.FEMALE,
    activityLevel: ActivityLevel.MODERATE,
    goal: Goal.LOSE,
    dietaryRestrictions: '',
  });

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.age && formData.weight && formData.height && formData.gender && formData.activityLevel && formData.goal) {
       // Auto-calculate suggested calories
       const completeProfile = formData as UserProfile;
       const bmr = calculateBMR(completeProfile);
       const tdee = calculateTDEE(bmr, completeProfile.activityLevel);
       const target = calculateTargetCalories(tdee, completeProfile.goal);
       
       onComplete(completeProfile, target);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-emerald-600 p-6 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Build Your Plan</h2>
        <p className="text-emerald-100 opacity-90 text-sm">Step {step} of 3</p>
        <div className="w-full bg-emerald-800 h-1.5 mt-4 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-300 h-full transition-all duration-300 ease-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center space-x-2 text-emerald-700 mb-4">
              <User size={20} />
              <h3 className="font-semibold text-lg">Personal Details</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select 
                  className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                >
                  {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input 
                  type="number" 
                  required
                  className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Years"
                  value={formData.age || ''}
                  onChange={(e) => handleChange('age', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
                <input 
                  type="number" 
                  required
                  className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="170"
                  value={formData.height || ''}
                  onChange={(e) => handleChange('height', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
                <input 
                  type="number" 
                  required
                  className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="70"
                  value={formData.weight || ''}
                  onChange={(e) => handleChange('weight', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Activity & Goal */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center space-x-2 text-emerald-700 mb-4">
              <Activity size={20} />
              <h3 className="font-semibold text-lg">Activity & Goal</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Activity Level</label>
              <div className="space-y-2">
                {Object.values(ActivityLevel).map((level) => (
                  <label key={level} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${formData.activityLevel === level ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="activity"
                      className="text-emerald-600 focus:ring-emerald-500"
                      checked={formData.activityLevel === level}
                      onChange={() => handleChange('activityLevel', level)}
                    />
                    <span className="ml-2 text-sm text-slate-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Diet & Finalize */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center space-x-2 text-emerald-700 mb-4">
              <Target size={20} />
              <h3 className="font-semibold text-lg">Refine Strategy</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Primary Goal</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(Goal).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleChange('goal', g)}
                    className={`p-2 text-sm rounded-lg border font-medium transition-colors ${formData.goal === g ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-300 hover:border-emerald-400'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dietary Restrictions (Optional)</label>
              <textarea 
                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none resize-none h-24"
                placeholder="e.g. Vegetarian, No Dairy, Gluten Free, No Peanuts..."
                value={formData.dietaryRestrictions}
                onChange={(e) => handleChange('dietaryRestrictions', e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
             <button 
              type="button"
              onClick={handleBack}
              className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
            >
              Back
            </button>
          ) : <div></div>}
         
          {step < 3 ? (
            <button 
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center font-medium transition-colors shadow-lg shadow-emerald-200"
            >
              Next <ChevronRight size={16} className="ml-1" />
            </button>
          ) : (
            <button 
              type="submit"
              disabled={isLoading}
              className="px-8 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center font-bold transition-all shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Calculator className="animate-spin mr-2 h-4 w-4" /> Calculating...
                </>
              ) : (
                <>Generate Plan <Activity size={16} className="ml-2" /></>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OnboardingForm;