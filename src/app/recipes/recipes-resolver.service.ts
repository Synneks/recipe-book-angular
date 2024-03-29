import { Actions, ofType } from "@ngrx/effects";
import * as RecipesActions from "./store/recipe.actions";
import { Store } from "@ngrx/store";
import { Injectable } from "@angular/core";
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from "@angular/router";

import { Recipe } from "./recipe.model";
import * as fromApp from "../store/app.reducer";
import { map, of, switchMap, take } from "rxjs";
@Injectable({ providedIn: "root" })
export class RecipesResolverService implements Resolve<{ recipes: Recipe[] }> {
    constructor(
        private store: Store<fromApp.AppState>,
        private actions$: Actions
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select("recipes").pipe(
            take(1),
            map((recipeState) => recipeState.recipes),
            switchMap((recipes) => {
                if (recipes.length === 0) {
                    this.store.dispatch(new RecipesActions.FetchRecipes());
                    return this.actions$.pipe(
                        ofType(RecipesActions.SET_RECIPES),
                        take(1)
                    );
                } else return of({ recipes });
            })
        );
    }
}
