import { Play, Square, Plus, ArrowLeft, Clock, Flame, ChefHat } from "lucide-react";
import { Recipe, ShoppingItem } from "../types";
import { useState, useEffect } from "react";

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onAddShoppingItem: (item: string) => void;
  shoppingList: ShoppingItem[];
}

export function RecipeDetail({ recipe, onBack, onAddShoppingItem, shoppingList }: RecipeDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  // Stop synthesis when unmounting or navigating away
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleReadAloud = (index: number, text: string) => {
    window.speechSynthesis.cancel();
    setCurrentStepIndex(index);
    setIsPlaying(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentStepIndex(-1);
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleStopReading = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentStepIndex(-1);
  };

  const readWholeRecipe = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(true);
    setCurrentStepIndex(0);

    const stepsText = recipe.steps.join(". Next, ");
    const utterance = new SpeechSynthesisUtterance(`Let's cook ${recipe.title}. Here are the steps: ${stepsText}. Enjoy your meal!`);
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentStepIndex(-1);
    };
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to recipes
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-8">
        <div className="p-8 border-b border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{recipe.title}</h1>
          <p className="text-gray-600 mb-6 text-lg">{recipe.description}</p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-600">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
              <Clock className="w-4 h-4 text-gray-400" />
              {recipe.prep_time}
            </div>
            <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg text-orange-800">
              <Flame className="w-4 h-4 text-orange-400" />
              {recipe.calories} kcal
            </div>
            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg text-amber-800">
              <ChefHat className="w-4 h-4 text-amber-500" />
              {recipe.difficulty}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="p-8 md:col-span-1 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Ingredients</h2>
            <ul className="space-y-4">
              {recipe.ingredients.map((ing, i) => {
                const isAdded = shoppingList.some(item => item.name.toLowerCase() === ing.name.toLowerCase());
                return (
                  <li key={i} className="flex flex-col gap-1 text-sm border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <span className="font-medium text-gray-900">{ing.name}</span>
                      <span className="text-gray-500 text-right">{ing.amount}</span>
                    </div>
                    {!ing.isPresent && (
                      <div className="flex items-center justify-between mt-1 pt-1">
                        <span className="text-xs font-semibold text-rose-500 uppercase tracking-wide">Missing</span>
                        {!isAdded ? (
                          <button 
                            onClick={() => onAddShoppingItem(ing.name)}
                            className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded transition-colors"
                          >
                            <Plus className="w-3 h-3" /> Add to List
                          </button>
                        ) : (
                          <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Added
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div className="p-8 md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Step-by-Step</h2>
              {!isPlaying ? (
                <button 
                  onClick={readWholeRecipe}
                  className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" /> Read Aloud
                </button>
              ) : (
                <button 
                  onClick={handleStopReading}
                  className="flex items-center gap-2 bg-rose-100 hover:bg-rose-200 text-rose-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Square className="w-4 h-4 fill-current" /> Stop
                </button>
              )}
            </div>
            
            <div className="space-y-6 lg:space-y-8">
              {recipe.steps.map((step, i) => (
                <div 
                  key={i} 
                  className={`flex gap-4 p-4 lg:p-6 rounded-xl transition-colors ${currentStepIndex === i ? 'bg-amber-50 ring-1 ring-amber-200' : 'hover:bg-gray-50'}`}
                >
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-sm lg:text-base ${currentStepIndex === i ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 tracking-widest uppercase mb-1">Step {i + 1}</h3>
                    <p className="text-xl lg:text-2xl text-gray-900 leading-relaxed lg:leading-loose font-medium mb-4">
                      {step}
                    </p>
                    <button 
                      onClick={() => handleReadAloud(i, step)}
                      className={`text-sm flex items-center gap-2 font-semibold px-4 py-2 rounded-lg transition-colors ${currentStepIndex === i ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
                    >
                      <Play className="w-4 h-4 fill-current" /> 
                      {currentStepIndex === i ? 'Reading...' : 'Read step'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
