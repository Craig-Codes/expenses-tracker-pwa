import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllTripsPage } from './all-trips.page';

const routes: Routes = [
  {
    path: '',
    component: AllTripsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllTripsPageRoutingModule {}
