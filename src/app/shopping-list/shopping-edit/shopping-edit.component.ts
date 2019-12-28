import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {addIngredient, deleteIngredient, stopEdit, updateIngredient} from '../store/shopping-list.actions';
import {AppState} from '../store/shopping-list.reducers';

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
        this.subscription = this.store.select('shoppingList').subscribe(data => {
            if (data.editedIngredientIndex > -1) {
                this.editedItem = data.editedIngredient;
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
            this.store.dispatch(updateIngredient({ingredient: newIngredient}));
        } else {
            this.store.dispatch(addIngredient({ingredient: newIngredient}));
        }
        this.editMode = false;
        form.reset();
    }

    onClear() {
        this.slForm.reset();
        this.editMode = false;
    }

    onDelete() {
        this.store.dispatch(deleteIngredient());
        this.onClear();
    }

    ngOnDestroy(): void {
        this.store.dispatch(stopEdit());
        this.subscription.unsubscribe();
    }
}
