import React from 'react';
import { Meal } from '../types';
import { Utensils, Flame, Wheat, Droplet, Drumstick } from 'lucide-react';

interface MealCardProps {
  meal: Meal;
}

const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const getMealColor = (type: string) => {
    switch (type) {
      case 'Breakfast': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'Lunch': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Dinner': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Snack': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getBadgeColor = (type: string) => {
     switch (type) {
      case 'Breakfast': return 'bg-orange-100 text-orange-800';
      case 'Lunch': return 'bg-emerald-100 text-emerald-800';
      case 'Dinner': return 'bg-blue-100 text-blue-800';
      case 'Snack': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  }

  return (
    <div className={`rounded-xl border p-5 transition-all hover:shadow-md bg-white border-slate-200`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getBadgeColor(meal.type)}`}>
            {meal.type}
          </span>
          <h3 className="text-lg font-bold text-slate-800 mt-2">{meal.name}</h3>
        </div>
        <div className="flex items-center text-slate-500 text-sm">
          <Flame className="w-4 h-4 mr-1 text-orange-500" />
          <span className="font-semibold">{meal.macros.calories}</span>
        </div>
      </div>
      
      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{meal.description}</p>
      
      {/* Macros Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-50 p-3 rounded-lg">
        <div className="text-center">
          <div className="flex items-center justify-center text-blue-500 text-xs mb-1">
             <Drumstick className="w-3 h-3 mr-1" /> Prot
          </div>
          <div className="font-semibold text-slate-700">{meal.macros.protein}g</div>
        </div>
        <div className="text-center border-l border-slate-200">
          <div className="flex items-center justify-center text-green-500 text-xs mb-1">
             <Wheat className="w-3 h-3 mr-1" /> Carb
          </div>
          <div className="font-semibold text-slate-700">{meal.macros.carbs}g</div>
        </div>
        <div className="text-center border-l border-slate-200">
           <div className="flex items-center justify-center text-amber-500 text-xs mb-1">
             <Droplet className="w-3 h-3 mr-1" /> Fat
          </div>
          <div className="font-semibold text-slate-700">{meal.macros.fats}g</div>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        <span className="font-medium">Ingredients: </span>
        {meal.ingredients.join(', ')}
      </div>
    </div>
  );
};

export default MealCard;