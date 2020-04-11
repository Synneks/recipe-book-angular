import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'Oatmeal',
      'Oatmeal with protein powder and creatine',
      'https://www.platingsandpairings.com/wp-content/uploads/2018/01/instant-pot-steel-cut-oats-8.jpg',
      [new Ingredient('Oat', 1), new Ingredient('Protein powder', 1)]
    ),
    new Recipe(
      'Omledefromaj',
      'Omlette with a piece of cheese, 2 slices of bread with hering and roe',
      'http://1.bp.blogspot.com/-3oAlD1bdQUQ/UNyd48An6qI/AAAAAAAACnA/rZcK3_9ptb0/s400/Herring+omelet+(1).jpg',
      [
        new Ingredient('Egg', 3),
        new Ingredient('Roe', 1),
        new Ingredient('Hering', 1),
        new Ingredient('Bread', 1),
      ]
    ),
  ];
  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
