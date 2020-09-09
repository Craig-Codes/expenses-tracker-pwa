import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReciptsEditPageRoutingModule } from './recipts-edit-routing.module';

import { ReciptsEditPage } from './recipts-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReciptsEditPageRoutingModule
  ],
  declarations: [ReciptsEditPage]
})
export class ReciptsEditPageModule {}
