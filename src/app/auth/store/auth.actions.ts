import {createAction, props} from '@ngrx/store';

export const signupStart = createAction('[Auth] Signup Start', props<{ email: string, password: string }>());
export const loginStart = createAction('[Auth] Login Start', props<{ email: string, password: string }>());
export const authenticateSuccess = createAction('[Auth] Authenticate',
  props<{ email: string, userId: string, token: string, expirationDate: Date }>());
export const authenticateFail = createAction('[Auth] Authenticate Fail', props<{ errorMessage: string }>());
export const autoLogin = createAction('[Auth] Auto Login');
export const logout = createAction('[Auth] Logout');
