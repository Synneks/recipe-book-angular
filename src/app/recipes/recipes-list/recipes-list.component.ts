import { Component, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css'],
})
export class RecipesListComponent {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  recipes: Recipe[] = [
    new Recipe(
      'Oatmeal',
      'Oatmeal with protein powder and creatine',
      'https://www.platingsandpairings.com/wp-content/uploads/2018/01/instant-pot-steel-cut-oats-8.jpg'
    ),
    new Recipe(
      'Omledefromaj',
      'Omlette with a piece of cheese, 2 slices of bread with hering and roe',
      'http://1.bp.blogspot.com/-3oAlD1bdQUQ/UNyd48An6qI/AAAAAAAACnA/rZcK3_9ptb0/s400/Herring+omelet+(1).jpg'
    ),
  ];

  onRecipeSelected(recipe: Recipe){
    this.recipeWasSelected.emit(recipe);
  }
}
