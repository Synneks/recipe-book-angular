import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, EMPTY, map, Observable, of, switchMap, tap } from "rxjs";
import { environment } from "src/environments/environment";
import * as AuthActions from "./auth.actions";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable()
export class AuthEffects {
    authLogin$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.LOGIN_START),
            switchMap((authData: AuthActions.LoginStart) =>
                this.performLogin(authData)
            )
        );
    });

    authSuccess$ = createEffect(
        (): any =>
            this.actions$.pipe(
                ofType(AuthActions.LOGIN),
                tap(() => this.router.navigate(["/"]))
            ),
        { dispatch: false }
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router
    ) {}

    private performLogin(
        authData: AuthActions.LoginStart
    ): Observable<AuthActions.Login | any> {
        return this.http
            .post<AuthResponseData>(
                "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" +
                    environment.firebaseAPIKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true,
                }
            )
            .pipe(
                map((resData: AuthResponseData) => {
                    const expirationDate = new Date(
                        new Date().getTime() + +resData.expiresIn * 1000
                    );
                    return new AuthActions.Login({
                        email: resData.email,
                        userId: resData.localId,
                        token: resData.idToken,
                        expirationDate: expirationDate,
                    });
                }),
                catchError((errorRes) => {
                    let errorMessage = "An unknown error occurred!";
                    if (!errorRes.error || !errorRes.error.error) {
                        return of(new AuthActions.LoginFailure(errorMessage));
                    }
                    switch (errorRes.error.error.message) {
                        case "EMAIL_EXISTS":
                            errorMessage = "This email exists already";
                            break;
                        case "EMAIL_NOT_FOUND":
                            errorMessage = "This email does not exist.";
                            break;
                        case "INVALID_PASSWORD":
                            errorMessage = "This password is not correct.";
                            break;
                    }
                    return of(new AuthActions.LoginFailure(errorMessage));
                })
            );
    }
}
