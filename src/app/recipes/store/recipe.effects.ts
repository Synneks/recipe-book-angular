import { HttpClient } from "@angular/common/http";
import { switchMap, map, tap, withLatestFrom } from "rxjs";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as RecipesActions from "../store/recipe.actions";
import { Recipe } from "../recipe.model";
import * as fromApp from "../../store/app.reducer";
import { Store } from "@ngrx/store";

@Injectable()
export class RecipeEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>
    ) {}

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

    storeRecipes$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(RecipesActions.STORE_RECIPES),
                withLatestFrom(this.store.select("recipes")),
                switchMap(([actonData, recipesState]) =>
                    this.http.put(
                        "https://ng-complete-guide-3310e.firebaseio.com/recipes.json",
                        recipesState.recipes
                    )
                )
            ),
        { dispatch: false }
    );
}
