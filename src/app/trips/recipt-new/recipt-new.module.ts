import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReciptNewPageRoutingModule } from './recipt-new-routing.module';

import { ReciptNewPage } from './recipt-new.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReciptNewPageRoutingModule
  ],
  declarations: [ReciptNewPage]
})
export class ReciptNewPageModule {}
