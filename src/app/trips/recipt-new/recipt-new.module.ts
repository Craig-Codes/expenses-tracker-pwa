import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ReciptNewPageRoutingModule } from "./recipt-new-routing.module";

import { ReciptNewPage } from "./recipt-new.page";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReciptNewPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [ReciptNewPage],
})
export class ReciptNewPageModule {}
