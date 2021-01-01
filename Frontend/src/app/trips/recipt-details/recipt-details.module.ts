import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReciptDetailsPageRoutingModule } from './recipt-details-routing.module';

import { ReciptDetailsPage } from './recipt-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReciptDetailsPageRoutingModule
  ],
  declarations: [ReciptDetailsPage]
})
export class ReciptDetailsPageModule {}
