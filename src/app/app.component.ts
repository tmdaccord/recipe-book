import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import * as firebase from 'firebase/app';
import {Store} from '@ngrx/store';
import * as AuthActions from './auth/store/auth.actions';
import {AppState} from './store/app.reducers';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private store: Store<AppState>, @Inject(PLATFORM_ID) private platformId) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(AuthActions.autoLogin());
    }

    const firebaseConfig = {
      apiKey: 'AIzaSyAwmHZBX6aU_l1AJdByEGuKSZdrJULn_F0',
      authDomain: 'ng-recipe-book-a334f.firebaseapp.com',
      databaseURL: 'https://ng-recipe-book-a334f.firebaseio.com',
      projectId: 'ng-recipe-book-a334f',
      storageBucket: 'ng-recipe-book-a334f.appspot.com',
      messagingSenderId: '767938663113',
      appId: '1:767938663113:web:f82327f4cb0c4caad47318'
    };
    firebase.initializeApp(firebaseConfig);
  }
}
