import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import {AppState} from '../../store/app.reducers';

@Component({
    selector: 'app-shopping-edit',
    templateUrl: './shopping-edit.component.html',
    styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    @ViewChild('f', {read: false, static: false}) slForm: NgForm;
    subscription: Subscription;
    editMode = false;
    editedItem: Ingredient;

    constructor(private store: Store<AppState>) {
    }

    ngOnInit() {
        this.subscription = this.store.select('shoppingList').subscribe(stateData => {
            if (stateData.editedIngredientIndex > -1) {
                this.editedItem = stateData.editedIngredient;
                this.editMode = true;
                this.slForm.setValue({
                    name: this.editedItem.name,
                    amount: this.editedItem.amount
                });
            } else {
                this.editMode = false;
            }
        });
    }

    onSubmit(form: NgForm) {
        const value = form.value;
        const newIngredient = new Ingredient(value.name, value.amount);
        if (this.editMode) {
            this.store.dispatch(ShoppingListActions.updateIngredient({ingredient: newIngredient}));
        } else {
            this.store.dispatch(ShoppingListActions.addIngredient({ingredient: newIngredient}));
        }
        this.editMode = false;
        form.reset();
    }

    onClear() {
        this.slForm.reset();
        this.editMode = false;
        this.store.dispatch(ShoppingListActions.stopEdit());
    }

    onDelete() {
        this.store.dispatch(ShoppingListActions.deleteIngredient());
        this.onClear();
    }

    ngOnDestroy(): void {
        this.store.dispatch(ShoppingListActions.stopEdit());
        this.subscription.unsubscribe();
    }
}
