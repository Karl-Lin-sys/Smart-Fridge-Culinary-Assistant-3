export interface RecipeIngredient {
  name: string;
  amount: string;
  isPresent: boolean;
}

export interface Recipe {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  prep_time: string;
  calories: number;
  ingredients: RecipeIngredient[];
  steps: string[];
}

export interface ExtractResponse {
  ingredients: string[];
  recipes: Recipe[];
}

export type ViewState = "HOME" | "RECIPE_DETAIL" | "SHOPPING_LIST";

export interface ShoppingItem {
  id: string;
  name: string;
  addedAt: number;
}
