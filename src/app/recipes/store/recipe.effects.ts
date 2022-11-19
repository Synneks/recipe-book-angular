import { HttpClient } from "@angular/common/http";
import { switchMap, map, tap } from "rxjs";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as RecipesActions from "../store/recipe.actions";
import { Recipe } from "../recipe.model";

@Injectable()
export class RecipeEffects {
    constructor(private actions$: Actions, private http: HttpClient) {}

    fetchRecipes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RecipesActions.FETCH_RECIPES),
            switchMap(() =>
                this.http.get<Recipe[]>(
                    "https://ng-complete-guide-3310e.firebaseio.com/recipes.json"
                )
            ),
            map((recipes) =>
                recipes.map((recipe) => {
                    return {
                        ...recipe,
                        ingredients: recipe.ingredients
                            ? recipe.ingredients
                            : [],
                    };
                })
            ),
            map((recipes) => {
                return new RecipesActions.SetRecipes(recipes);
            })
        )
    );
}
