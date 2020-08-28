import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripNewPageRoutingModule } from './trip-new-routing.module';

import { TripNewPage } from './trip-new.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TripNewPageRoutingModule
  ],
  declarations: [TripNewPage]
})
export class TripNewPageModule {}
