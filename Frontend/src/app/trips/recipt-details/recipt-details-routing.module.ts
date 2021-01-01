import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReciptDetailsPage } from './recipt-details.page';

const routes: Routes = [
  {
    path: '',
    component: ReciptDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReciptDetailsPageRoutingModule {}
