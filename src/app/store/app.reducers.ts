import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromRecipes from '../recipes/store/recipe.reducer';
import {ActionReducerMap} from '@ngrx/store';

export interface AppState {
  shoppingList: fromShoppingList.State;
  auth: fromAuth.State;
  recipes: fromRecipes.State;
}

export const reducers: ActionReducerMap<AppState> = {
  shoppingList: fromShoppingList.reducer,
  auth: fromAuth.reducer,
  recipes: fromRecipes.reducer
};
