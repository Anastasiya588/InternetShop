import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalRoutingModule } from './personal-routing.module';
import { FavoriteComponent } from './favorite/favorite.component';
import { OrdersComponent } from './orders/orders.component';
import { InfoComponent } from './info/info.component';
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    FavoriteComponent,
    OrdersComponent,
    InfoComponent
  ],
    imports: [
        CommonModule,
        PersonalRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class PersonalModule { }
