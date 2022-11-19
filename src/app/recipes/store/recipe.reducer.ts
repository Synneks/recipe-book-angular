import { Recipe } from "./../recipe.model";
import * as RecipesActions from "./recipe.actions";

export interface State {
    recipes: Recipe[];
}

const inisitalState: State = {
    recipes: [],
};

export function recipeReducer(
    state = inisitalState,
    action: RecipesActions.RecipesActionsTypes
) {
    switch (action.type) {
        case RecipesActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload],
            };
        default:
            return state;
    }
}
