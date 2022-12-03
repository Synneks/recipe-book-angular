import { Store } from "@ngrx/store";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { Recipe } from "../recipe.model";
import * as fromApp from "../../store/app.reducer";
import { map, switchMap } from "rxjs";
import * as RecipesActions from "../../recipes/store/recipe.actions";
import * as ShoppingListActions from "../../shopping-list/store/shopping-list.actions";

@Component({
    selector: "app-recipe-detail",
    templateUrl: "./recipe-detail.component.html",
    styleUrls: ["./recipe-detail.component.css"],
})
export class RecipeDetailComponent implements OnInit {
    recipe: Recipe;
    id: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<fromApp.AppState>
    ) {}

    ngOnInit() {
        this.route.params
            .pipe(
                map((params: Params) => +params["id"]),
                switchMap((id) => {
                    this.id = id;
                    return this.store.select("recipes");
                }),
                map((recipesState) => recipesState.recipes.at(this.id))
            )
            .subscribe((recipe) => (this.recipe = recipe));
    }

    onAddToShoppingList() {
        this.store.dispatch(
            ShoppingListActions.addIngredients({
                ingredients: this.recipe.ingredients,
            })
        );
    }

    onEditRecipe() {
        this.router.navigate(["edit"], { relativeTo: this.route });
        // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
    }

    onDeleteRecipe() {
        this.store.dispatch(new RecipesActions.RemoveRecipe(this.id));
        this.router.navigate(["/recipes"]);
    }
}
