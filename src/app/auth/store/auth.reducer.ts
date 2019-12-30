import {Action, createReducer, on} from '@ngrx/store';
import * as AuthActions from './auth.actions';
import {User} from '../user.model';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

export const initialState: State = {
  user: null,
  authError: null,
  loading: false
};

const authReducer = createReducer(
  initialState,
  // on(AuthActions.signup, (state) => ({
  //   ...state,
  //   authenticated: true
  // })),
  on(AuthActions.loginStart, state => {
    return {
      ...state,
      authError: null,
      loading: true
    };
  }),
  on(AuthActions.signupStart, state => {
    return {
      ...state,
      authError: null,
      loading: true
    };
  }),
  on(AuthActions.authenticateSuccess, (state, {email, userId, token, expirationDate}) => {
    const user = new User(email, userId, token, expirationDate);
    return {
      ...state,
      user,
      authError: null,
      loading: false
    };
  }),
  on(AuthActions.authenticateFail, (state, {errorMessage}) => {
    return {
      ...state,
      user: null,
      authError: errorMessage,
      loading: false
    };
  }),
  on(AuthActions.logout, (state) => ({
    ...state,
    user: null
  })),
  // on(AuthActions.setToken, (state, {token}) => ({
  //   ...state,
  //   token
  // })),
  // on(ShoppingListActions.addIngredients, (state, {ingredients}) => ({
  //   ...state,
  //   ingredients: [...state.ingredients, ...ingredients]
  // })),
  // on(ShoppingListActions.updateIngredient, (state, {ingredient}) => {
  //   const newIngredients = [...state.ingredients];
  //   newIngredients[state.editedIngredientIndex] = ingredient;
  //   return {
  //     ...state,
  //     ingredients: newIngredients,
  //     editedIngredient: null,
  //     editedIngredientIndex: -1
  //   };
  // }),
  // on(ShoppingListActions.deleteIngredient, (state) => {
  //   const newIngredients = [...state.ingredients];
  //   newIngredients.splice(state.editedIngredientIndex, 1);
  //   return {
  //     ...state,
  //     ingredients: newIngredients,
  //     editedIngredient: null,
  //     editedIngredientIndex: -1
  //   };
  // }),
  // on(ShoppingListActions.startEdit, (state, {index}) => {
  //   return {
  //     ...state,
  //     editedIngredient: state.ingredients[index],
  //     editedIngredientIndex: index
  //   };
  // }),
  // on(ShoppingListActions.stopEdit, (state) => {
  //   return {
  //     ...state,
  //     editedIngredient: null,
  //     editedIngredientIndex: -1
  //   };
  // })
);

export function reducer(state: State | undefined, action: Action) {
  return authReducer(state, action);
}
