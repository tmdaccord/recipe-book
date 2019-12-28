import { createAction, props } from '@ngrx/store';
import {Ingredient} from '../../shared/ingredient.model';

export const addIngredient = createAction('ADD_INGREDIENT', props<{ingredient: Ingredient}>());
export const addIngredients = createAction('ADD_INGREDIENTS', props<{ingredients: Ingredient[]}>());
export const updateIngredient = createAction('UPDATE_INGREDIENT', props<{ingredient: Ingredient}>());
export const deleteIngredient = createAction('DELETE_INGREDIENT');
export const startEdit = createAction('START_EDIT', props<{index: number}>());
export const stopEdit = createAction('STOP_EDIT');
