import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, tap, take, exhaustMap } from "rxjs/operators";

import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class DataStorageService {
    constructor(
        private http: HttpClient,
        private recipeService: RecipeService,
        private authService: AuthService
    ) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http
            .put(
                "https://ng-complete-guide-3310e.firebaseio.com/recipes.json",
                recipes
            )
            .subscribe({
                next: (response) => {
                    console.log(response);
                },
                error: (error) => {
                    console.log(error);
                },
            });
    }

    fetchRecipes() {
        return this.http
            .get<Recipe[]>(
                "https://ng-complete-guide-3310e.firebaseio.com/recipes.json"
            )
            .pipe(
                map((recipes) => {
                    console.log(recipes);

                    return recipes.map((recipe) => {
                        return {
                            ...recipe,
                            ingredients: recipe.ingredients
                                ? recipe.ingredients
                                : [],
                        };
                    });
                }),
                tap((recipes) => {
                    console.warn("fac caca");

                    this.recipeService.setRecipes(recipes);
                })
            );
    }
}
