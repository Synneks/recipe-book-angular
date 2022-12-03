import { Action } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const SET_RECIPES = "[Recipes] Set Recipes";
export const FETCH_RECIPES = "[Recipes] Fetch Recipes";
export const STORE_RECIPES = "[Recipes] Store Recipes";
export const ADD_RECIPE = "[Recipes] Add Recipe";
export const REMOVE_RECIPE = "[Recipes] Remove Recipe";
export const UPDATE_RECIPE = "[Recipes] Update Recipe";

export class SetRecipes implements Action {
    readonly type = SET_RECIPES;

    constructor(public payload: Recipe[]) {}
}

export class FetchRecipes implements Action {
    readonly type = FETCH_RECIPES;
}

export class StoreRecipes implements Action {
    readonly type = STORE_RECIPES;
}

export class UpdateRecipe implements Action {
    readonly type = UPDATE_RECIPE;

    constructor(public payload: { index: number; recipe: Recipe }) {}
}

export class AddRecipe implements Action {
    readonly type = ADD_RECIPE;

    constructor(public payload: Recipe) {}
}

export class RemoveRecipe implements Action {
    readonly type = REMOVE_RECIPE;

    constructor(public payload: number) {}
}

export type RecipesActionsTypes =
    | SetRecipes
    | FetchRecipes
    | StoreRecipes
    | RemoveRecipe
    | AddRecipe
    | UpdateRecipe;
