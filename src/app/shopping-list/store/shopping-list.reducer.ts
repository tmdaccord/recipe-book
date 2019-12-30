import {Action, createReducer, on} from '@ngrx/store';
import * as ShoppingListActions from './shopping-list.actions';
import {Ingredient} from '../../shared/ingredient.model';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

export const initialState: State = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};

const shoppingListReducer = createReducer(
  initialState,
  on(ShoppingListActions.addIngredient, (state, {ingredient}) => ({
    ...state,
    ingredients: [...state.ingredients, ingredient]
  })),
  on(ShoppingListActions.addIngredients, (state, {ingredients}) => ({
    ...state,
    ingredients: [...state.ingredients, ...ingredients]
  })),
  on(ShoppingListActions.updateIngredient, (state, {ingredient}) => {
    const newIngredients = [...state.ingredients];
    newIngredients[state.editedIngredientIndex] = ingredient;
    return {
      ...state,
      ingredients: newIngredients,
      editedIngredient: null,
      editedIngredientIndex: -1
    };
  }),
  on(ShoppingListActions.deleteIngredient, (state) => {
    // const newIngredients = [...state.ingredients];
    // newIngredients.splice(state.editedIngredientIndex, 1);
    return {
      ...state,
      ingredients: state.ingredients.filter((ig, igIndex) => {
        return igIndex !== state.editedIngredientIndex;
      }),
      editedIngredient: null,
      editedIngredientIndex: -1
    };
  }),
  on(ShoppingListActions.startEdit, (state, {index}) => {
    return {
      ...state,
      editedIngredient: {...state.ingredients[index]},
      editedIngredientIndex: index
    };
  }),
  on(ShoppingListActions.stopEdit, (state) => {
    return {
      ...state,
      editedIngredient: null,
      editedIngredientIndex: -1
    };
  })
);

export function reducer(state: State | undefined, action: Action) {
  return shoppingListReducer(state, action);
}
