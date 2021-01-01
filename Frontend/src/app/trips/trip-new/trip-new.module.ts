import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TripNewPageRoutingModule } from "./trip-new-routing.module";

import { TripNewPage } from "./trip-new.page";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TripNewPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [TripNewPage],
})
export class TripNewPageModule {}
