import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripNewPage } from './trip-new.page';

const routes: Routes = [
  {
    path: '',
    component: TripNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripNewPageRoutingModule {}
