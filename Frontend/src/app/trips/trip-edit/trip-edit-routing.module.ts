import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripEditPage } from './trip-edit.page';

const routes: Routes = [
  {
    path: '',
    component: TripEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripEditPageRoutingModule {}
