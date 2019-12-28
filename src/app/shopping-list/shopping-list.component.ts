import {Component, OnInit} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from './store/shopping-list.reducers';
import {startEdit} from './store/shopping-list.actions';

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
    shoppingListState: Observable<{ingredients: Ingredient[]}>;

    constructor(private store: Store<AppState>) {
    }

    ngOnInit() {
        this.shoppingListState = this.store.select('shoppingList');
    }

    onEditItem(index: number) {
        this.store.dispatch(startEdit({index}));
    }
}
