import { Action } from "@ngrx/store";

import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

const initialState: State = {
    ingredients: [new Ingredient("Apples", 5), new Ingredient("Tomatoes", 10)],
    editedIngredient: null,
    editedIngredientIndex: -1,
};

export function shoppingListReducer(
    state = initialState,
    action: ShoppingListActions.ShoppingListActionTypes
) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload],
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload],
            };
        case ShoppingListActions.UPDATE_INGREDIENT:
            const ingredientToUpdate =
                state.ingredients[state.editedIngredientIndex];
            const updatedIngredient = {
                ...ingredientToUpdate,
                ...action.payload,
            };
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredientIndex: initialState.editedIngredientIndex,
                editedIngredient: initialState.editedIngredient,
            };
        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter(
                    (ing, ingIndex) => ingIndex !== state.editedIngredientIndex
                ),
                editedIngredientIndex: initialState.editedIngredientIndex,
                editedIngredient: initialState.editedIngredient,
            };
        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredient: { ...state.ingredients[action.payload] },
                editedIngredientIndex: action.payload,
            };
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: initialState.editedIngredient,
                editedIngredientIndex: initialState.editedIngredientIndex,
            };
        default: {
            return initialState;
        }
    }
}
