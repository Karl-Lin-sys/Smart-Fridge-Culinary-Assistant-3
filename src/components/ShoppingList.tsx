import { ShoppingItem } from "../types";
import { Trash2, ShoppingCart, Plus } from "lucide-react";
import { useState } from "react";

interface ShoppingListProps {
  items: ShoppingItem[];
  onRemoveItem: (id: string) => void;
  onAddItem: (name: string) => void;
}

export function ShoppingList({ items, onRemoveItem, onAddItem }: ShoppingListProps) {
  const [newItemName, setNewItemName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      onAddItem(newItemName.trim());
      setNewItemName("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
          <ShoppingCart className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shopping List</h1>
          <p className="text-gray-500">Items you need for your upcoming recipes.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <form onSubmit={handleSubmit} className="p-4 border-b border-gray-100 flex gap-2">
          <input 
            type="text" 
            placeholder="Add an item manually..." 
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button 
            type="submit"
            disabled={!newItemName.trim()}
            className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        {items.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <ShoppingCart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p>Your shopping list is empty.</p>
            <p className="text-sm mt-1">Missing ingredients from recipes will appear here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map(item => (
              <li key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded border border-gray-300 bg-white flex items-center justify-center pointer-events-none">
                    {/* Visual checkbox */}
                  </div>
                  <span className="font-medium text-gray-800">{item.name}</span>
                </div>
                <button 
                  onClick={() => onRemoveItem(item.id)}
                  className="text-gray-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
