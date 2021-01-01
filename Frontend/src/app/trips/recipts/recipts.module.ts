import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReciptsPageRoutingModule } from './recipts-routing.module';

import { ReciptsPage } from './recipts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReciptsPageRoutingModule
  ],
  declarations: [ReciptsPage]
})
export class ReciptsPageModule {}
