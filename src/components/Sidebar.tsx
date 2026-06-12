import { Filter, ShoppingCart, Home } from "lucide-react";

interface SidebarProps {
  currentView: "HOME" | "RECIPE_DETAIL" | "SHOPPING_LIST";
  onNavigate: (view: "HOME" | "SHOPPING_LIST") => void;
  dietaryFilters: string[];
  onToggleFilter: (filter: string) => void;
  shoppingListCount: number;
}

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Keto",
  "Paleo",
  "Gluten-Free",
  "Dairy-Free",
];

export function Sidebar({ currentView, onNavigate, dietaryFilters, onToggleFilter, shoppingListCount }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full flex flex-col justify-between overflow-y-auto hidden md:flex">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-8">
          <span className="text-xl">🍳</span> Smart Fridge
        </h1>

        <nav className="space-y-2 mb-8">
          <button 
            onClick={() => onNavigate("HOME")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'HOME' || currentView === 'RECIPE_DETAIL' ? 'bg-amber-50 text-amber-900' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button 
            onClick={() => onNavigate("SHOPPING_LIST")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'SHOPPING_LIST' ? 'bg-amber-50 text-amber-900' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ShoppingCart className="w-4 h-4" />
            Shopping List
            {shoppingListCount > 0 && (
              <span className="ml-auto bg-amber-100 text-amber-800 py-0.5 px-2 rounded-full text-xs font-semibold">
                {shoppingListCount}
              </span>
            )}
          </button>
        </nav>

        <div>
          <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 flex items-center gap-2">
            <Filter className="w-3 h-3" />
            Dietary Filters
          </h2>
          <div className="space-y-2">
            {DIETARY_OPTIONS.map((filter) => {
              const active = dietaryFilters.includes(filter);
              return (
                <label key={filter} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer p-1 rounded hover:bg-gray-50">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 bg-white shadow-sm"
                    checked={active}
                    onChange={() => onToggleFilter(filter)}
                  />
                  {filter}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
