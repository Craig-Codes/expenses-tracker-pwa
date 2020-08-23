import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllTripsPageRoutingModule } from './all-trips-routing.module';

import { AllTripsPage } from './all-trips.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllTripsPageRoutingModule
  ],
  declarations: [AllTripsPage]
})
export class AllTripsPageModule {}
