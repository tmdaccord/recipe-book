import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthRoutingModule} from './auth-routing.module';
import { AuthComponent } from './auth.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    FormsModule,
    AuthRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class AuthModule {
}
