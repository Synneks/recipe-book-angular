import { AuthService } from "./../auth.service";
import { User } from "./../user.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
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

const LOGIN_URL =
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" +
    environment.firebaseAPIKey;
const SIGNUP_URL =
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" +
    environment.firebaseAPIKey;

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) {}

    authSignUp$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.SIGNUP_START),
            switchMap((signupAction: AuthActions.SignupStart) =>
                this.makeLoginRequest(signupAction, SIGNUP_URL).pipe(
                    tap((resData: AuthResponseData) =>
                        this.authService.setLogoutTimer(
                            +resData.expiresIn * 1000
                        )
                    ),
                    map((authData: AuthResponseData) =>
                        this.handleAuthenticationSuccess(authData)
                    ),
                    catchError((errorRes: HttpErrorResponse) =>
                        this.handleAuthenticationFail(errorRes)
                    )
                )
            )
        )
    );

    authLogin$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.LOGIN_START),
            switchMap((authData: AuthActions.LoginStart) =>
                this.makeLoginRequest(authData, LOGIN_URL).pipe(
                    tap((resData: AuthResponseData) => {
                        this.authService.setLogoutTimer(
                            +resData.expiresIn * 1000
                        );
                    }),
                    map((resData: AuthResponseData) =>
                        this.handleAuthenticationSuccess(resData)
                    ),
                    catchError((errorRes) =>
                        this.handleAuthenticationFail(errorRes)
                    )
                )
            )
        );
    });

    private makeLoginRequest(
        authData: AuthActions.LoginStart | AuthActions.SignupStart,
        url: string
    ) {
        return this.http.post<AuthResponseData>(url, {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
        });
    }

    private handleAuthenticationFail(errorRes: HttpErrorResponse) {
        let errorMessage = "An unknown error occurred!";
        if (!errorRes.error || !errorRes.error.error) {
            return of(new AuthActions.AuthenticateFail(errorMessage));
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
        return of(new AuthActions.AuthenticateFail(errorMessage));
    }

    private handleAuthenticationSuccess(resData: AuthResponseData) {
        const expirationDate = new Date(
            new Date().getTime() + +resData.expiresIn * 1000
        );
        const user = new User(
            resData.email,
            resData.localId,
            resData.idToken,
            expirationDate
        );
        localStorage.setItem("userData", JSON.stringify(user));
        return new AuthActions.AuthenticateSuccess({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate: expirationDate,
        });
    }

    authSuccess$ = createEffect(
        (): any =>
            this.actions$.pipe(
                ofType(AuthActions.AUTHENTICATE_SUCCESS),
                tap(() => this.router.navigate(["/"]))
            ),
        { dispatch: false }
    );

    authLogout$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.LOGOUT, AuthActions.AUTO_LOGOUT),
                tap(() => {
                    console.log("clear timer");
                    this.authService.clearLogoutTimer();
                    console.log("clear clear localstorage");

                    localStorage.removeItem("userData");
                    console.log("navigate");

                    this.router.navigate(["/auth"]);
                })
            ),
        { dispatch: false }
    );

    authAutoLogin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.AUTO_LOGIN),
            map(() => {
                const userData: {
                    email: string;
                    id: string;
                    _token: string;
                    _tokenExpirationDate: string;
                } = JSON.parse(localStorage.getItem("userData"));
                if (!userData) {
                    return { type: "Nothing" };
                }

                const loadedUser = new User(
                    userData.email,
                    userData.id,
                    userData._token,
                    new Date(userData._tokenExpirationDate)
                );

                if (loadedUser.token) {
                    // this.user.next(loadedUser);
                    const expirationDuration =
                        new Date(userData._tokenExpirationDate).getTime() -
                        new Date().getTime();
                    // this.autoLogout(expirationDuration);
                    this.authService.setLogoutTimer(expirationDuration);

                    return new AuthActions.AuthenticateSuccess({
                        email: loadedUser.email,
                        userId: loadedUser.id,
                        token: loadedUser.token,
                        expirationDate: new Date(userData._tokenExpirationDate),
                    });
                }
                return { type: "Nothing" };
            })
        )
    );
}
