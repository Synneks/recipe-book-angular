import * as RecipesActions from "./../recipes/store/recipe.actions";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { map, Subscription } from "rxjs";

import { DataStorageService } from "../shared/data-storage.service";
import { AuthService } from "../auth/auth.service";
import * as fromApp from "../store/app.reducer";
import { Store } from "@ngrx/store";
import * as AuthActions from "../auth/store/auth.actions";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    private userSub: Subscription;

    constructor(
        private dataStorageService: DataStorageService,
        // private authService: AuthService,
        private store: Store<fromApp.AppState>
    ) {}

    ngOnInit() {
        this.userSub = this.store
            .select("auth")
            .pipe(map((authState) => authState.user))
            .subscribe((user) => {
                this.isAuthenticated = !!user;
            });
    }

    onSaveData() {
        // this.dataStorageService.storeRecipes();
        this.store.dispatch(new RecipesActions.StoreRecipes());
    }

    onFetchData() {
        this.store.dispatch(new RecipesActions.FetchRecipes());
    }

    onLogout() {
        // this.authService.logout();
        this.store.dispatch(new AuthActions.Logout());
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}
