import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripEditPageRoutingModule } from './trip-edit-routing.module';

import { TripEditPage } from './trip-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TripEditPageRoutingModule
  ],
  declarations: [TripEditPage]
})
export class TripEditPageModule {}
