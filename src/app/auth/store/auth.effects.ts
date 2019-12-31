import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import * as AuthActions from './auth.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {AuthResponseData, AuthService} from '../auth.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {User} from '../user.model';

const handleAuthentication = (authenticationData) => {
  const expirationDate = new Date(new Date().getTime() + +authenticationData.expiresIn * 1000);
  const user = new User(authenticationData.email, authenticationData.localId, authenticationData.idToken, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return AuthActions.authenticateSuccess({
    email: authenticationData.email,
    userId: authenticationData.localId,
    token: authenticationData.idToken,
    expirationDate,
    redirect: true
  });
};

const handleError = (errorResponse) => {
  let errorMessage = 'An unknown error occurred!';
  if (errorResponse.error && errorResponse.error.error) {
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email address is already in use by another account';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'Password sign-in is disabled for this project';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'There is no user record corresponding to this email';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is invalid';
        break;
      case 'USER_DISABLED':
        errorMessage = 'The user account has been disabled by an administrator';
        break;
    }
  }
  return of(AuthActions.authenticateFail({errorMessage}));
};

@Injectable()
export class AuthEffects {
  authSingup$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.signupStart),
    switchMap(signupAction => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAwmHZBX6aU_l1AJdByEGuKSZdrJULn_F0',
        {
          email: signupAction.email,
          password: signupAction.password,
          returnSecureToken: true
        }
      ).pipe(
        tap(responseData => {
          this.authService.setLogoutTimer(+responseData.expiresIn * 1000);
        }),
        map(responseData => handleAuthentication(responseData)),
        catchError(errorResponse => handleError(errorResponse))
      );
    })
  ));

  authLogin$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginStart),
    switchMap(loginAction => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAwmHZBX6aU_l1AJdByEGuKSZdrJULn_F0',
        {
          email: loginAction.email,
          password: loginAction.password,
          returnSecureToken: true
        }
      ).pipe(
        tap(responseData => {
          this.authService.setLogoutTimer(+responseData.expiresIn * 1000);
        }),
        map(responseData => handleAuthentication(responseData)),
        catchError(errorResponse => handleError(errorResponse))
      );
    })
  ));

  authRedirect$ = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.authenticateSuccess),
      tap(authSuccessAction => {
        if (authSuccessAction.redirect) {
          this.router.navigate(['/']);
        }
      }),
    ),
    {dispatch: false}
  );

  autoLogin$ = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const userData: {
          email: string,
          id: string,
          _token: string,
          _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          return {type: 'DUMMY'};
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

        if (loadedUser.token) {
          const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          return AuthActions.authenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false
          });
        }
        return {type: 'DUMMY'};
      }),
    )
  );

  authLogout$ = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
      }),
    ),
    {dispatch: false}
  );

  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {
  }
}
