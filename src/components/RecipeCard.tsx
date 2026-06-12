import { Clock, Flame, ChefHat, Check } from "lucide-react";
import { Recipe } from "../types";

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  const presentIngredients = recipe.ingredients.filter(i => i.isPresent).length;
  const totalIngredients = recipe.ingredients.length;
  const missingCount = totalIngredients - presentIngredients;

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
      onClick={() => onSelect(recipe)}
    >
      <div className="p-5 flex-grow">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
          {recipe.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center gap-4 text-xs font-medium text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {recipe.prep_time}
          </div>
          <div className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            {recipe.calories} kcal
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="w-3.5 h-3.5 text-amber-500" />
            {recipe.difficulty}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-green-500" />
            <span>{presentIngredients}/{totalIngredients} ingredients</span>
          </div>
          {missingCount > 0 ? (
            <span className="text-xs font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
              Missing {missingCount}
            </span>
          ) : (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
              You have everything!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
