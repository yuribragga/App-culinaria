import { Recipe } from '../models/Recipe';

let recipes: Recipe[] = [];

export const addRecipe = (recipe: Recipe): Recipe => {
  recipes.push(recipe);
  return recipe;
};

export const getRecipes = (): Recipe[] => {
  return recipes;
};

export const searchRecipes = (query: string): Recipe[] => {
  return recipes.filter(
    (recipe) =>
      recipe.name.includes(query) ||
      recipe.ingredients.some((ingredient) => ingredient.includes(query))
  );
};