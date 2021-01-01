import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ReciptsEditPageRoutingModule } from "./recipts-edit-routing.module";

import { ReciptsEditPage } from "./recipts-edit.page";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReciptsEditPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [ReciptsEditPage],
})
export class ReciptsEditPageModule {}
