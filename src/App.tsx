/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { ImageUploader } from "./components/ImageUploader";
import { RecipeCard } from "./components/RecipeCard";
import { RecipeDetail } from "./components/RecipeDetail";
import { ShoppingList } from "./components/ShoppingList";
import { Recipe, ViewState, ShoppingItem } from "./types";
import { Menu, X } from "lucide-react";

export default function App() {
  const [view, setView] = useState<ViewState>("HOME");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // App State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  const [shoppingListItems, setShoppingListItems] = useState<ShoppingItem[]>([]);

  const toggleDietaryFilter = (filter: string) => {
    setDietaryFilters(prev => {
      const newFilters = prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter];
        
      // If we already have an image, re-analyze automatically with the new filters
      if (currentImage && newFilters !== prev) {
        // Run asynchronously
        setTimeout(() => handleImageUploaded(currentImage, newFilters), 10);
      }
      return newFilters;
    });
  };

  const navigate = (newView: "HOME" | "SHOPPING_LIST") => {
    setView(newView);
    if (newView === "HOME") {
      setSelectedRecipe(null);
    }
    setIsMobileMenuOpen(false);
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView("RECIPE_DETAIL");
  };

  const handleAddShoppingItem = (name: string) => {
    // Only add if not already present
    if (!shoppingListItems.some(i => i.name.toLowerCase() === name.toLowerCase())) {
      setShoppingListItems(prev => [
        ...prev, 
        { id: Math.random().toString(36).substr(2, 9), name, addedAt: Date.now() }
      ]);
    }
  };

  const handleRemoveShoppingItem = (id: string) => {
    setShoppingListItems(prev => prev.filter(item => item.id !== id));
  };

  const handleImageUploaded = async (base64Image: string, filtersToUse = dietaryFilters) => {
    setCurrentImage(base64Image);
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch('/api/extract-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: base64Image,
          dietaryRestrictions: filtersToUse 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze image");
      }

      const data = await response.json();
      setDetectedIngredients(data.ingredients || []);
      setRecipes(data.recipes || []);
      setView("HOME");
      setSelectedRecipe(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#fafafa] font-sans antialiased text-gray-900 overflow-hidden">
      {/* Mobile Header & Menu Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 fixed top-0 w-full z-20">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <span>🍳</span> Smart Fridge
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30 flex">
          <div className="w-64 bg-white h-full shadow-xl">
             <Sidebar 
                currentView={view} 
                onNavigate={navigate} 
                dietaryFilters={dietaryFilters}
                onToggleFilter={toggleDietaryFilter}
                shoppingListCount={shoppingListItems.length}
              />
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full shadow-sm z-10 relative">
        <Sidebar 
          currentView={view} 
          onNavigate={navigate} 
          dietaryFilters={dietaryFilters}
          onToggleFilter={toggleDietaryFilter}
          shoppingListCount={shoppingListItems.length}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto px-4 md:px-8 mt-16 md:mt-0 py-8 relative">
        <div className="max-w-6xl mx-auto h-full">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mb-6">
              <strong className="font-semibold">Error:</strong> {error}
            </div>
          )}

          {view === "HOME" && (
            <div className="space-y-12">
              <section className="max-w-2xl">
                <header className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">What's in your fridge?</h2>
                  <p className="text-gray-500 text-lg">Snap a photo and we'll handle the rest.</p>
                </header>
                <ImageUploader onImageSelected={handleImageUploaded} isAnalyzing={isAnalyzing} />
              </section>

              {!isAnalyzing && detectedIngredients.length > 0 && (
                <section>
                  <div className="mb-8">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3 block">Detected Ingredients</h2>
                    <div className="flex flex-wrap gap-2">
                      {detectedIngredients.map((ing, i) => (
                        <span key={i} className="bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded-full text-sm font-medium text-gray-700">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-end justify-between border-b border-gray-200 pb-4 mb-6">
                       <div>
                         <h2 className="text-2xl font-bold text-gray-900">Suggested Recipes</h2>
                         {dietaryFilters.length > 0 && (
                            <p className="text-sm text-gray-500 mt-1">Filtered by: {dietaryFilters.join(", ")}</p>
                         )}
                       </div>
                    </div>
                    
                    {recipes.length === 0 ? (
                      <p className="text-gray-500 italic">No recipes could be suggested with these ingredients and filters.</p>
                    ) : (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map((recipe, i) => (
                          <RecipeCard 
                            key={i} 
                            recipe={recipe} 
                            onSelect={handleRecipeSelect} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          )}

          {view === "RECIPE_DETAIL" && selectedRecipe && (
            <RecipeDetail 
              recipe={selectedRecipe} 
              onBack={() => setView("HOME")} 
              onAddShoppingItem={handleAddShoppingItem}
              shoppingList={shoppingListItems}
            />
          )}

          {view === "SHOPPING_LIST" && (
             <ShoppingList 
               items={shoppingListItems} 
               onRemoveItem={handleRemoveShoppingItem} 
               onAddItem={handleAddShoppingItem} 
             />
          )}
        </div>
      </main>
    </div>
  );
}
