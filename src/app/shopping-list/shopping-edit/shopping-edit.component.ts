import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "../store/shopping-list.actions";
import * as fromApp from "../../store/app.reducer";
import { formatCurrency } from "@angular/common";

@Component({
    selector: "app-shopping-edit",
    templateUrl: "./shopping-edit.component.html",
    styleUrls: ["./shopping-edit.component.css"],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    @ViewChild("f", { static: false }) slForm: NgForm;
    subscription: Subscription;
    editMode = false;
    editedItem: Ingredient;

    constructor(private store: Store<fromApp.AppState>) {}

    ngOnInit() {
        this.subscription = this.store
            .select("shoppingList")
            .subscribe((stateData) => {
                if (stateData.editIndex > -1) {
                    this.editMode = true;
                    this.editedItem =
                        stateData.ingredients[stateData.editIndex];
                    this.slForm.setValue({
                        name: this.editedItem.name,
                        amount: this.editedItem.amount,
                    });
                } else {
                    this.editMode = false;
                }
            });
        // this.subscription = this.slService.startedEditing.subscribe(
        //     (index: number) => {
        //         this.editedItemIndex = index;
        //         this.editMode = true;
        //         this.editedItem = this.slService.getIngredient(index);
        //         this.slForm.setValue({
        //             name: this.editedItem.name,
        //             amount: this.editedItem.amount,
        //         });
        //     }
        // );
    }

    onSubmit(form: NgForm) {
        const value = form.value;
        const newIngredient = new Ingredient(value.name, value.amount);
        if (this.editMode) {
            this.store.dispatch(
                ShoppingListActions.updateIngredient({
                    ingredient: newIngredient,
                })
            );
        } else {
            this.store.dispatch(
                ShoppingListActions.addIngredient({ ingredient: newIngredient })
            );
        }
        this.editMode = false;
        form.reset();
    }

    onClear() {
        this.store.dispatch(ShoppingListActions.stopEdit());
        this.slForm.reset();
        this.editMode = false;
    }

    onDelete() {
        this.store.dispatch(ShoppingListActions.deleteIngredient());
        this.onClear();
    }

    ngOnDestroy() {
        this.store.dispatch(ShoppingListActions.stopEdit());
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
