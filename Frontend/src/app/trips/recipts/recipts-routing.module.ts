import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReciptsPage } from './recipts.page';

const routes: Routes = [
  {
    path: '',
    component: ReciptsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReciptsPageRoutingModule {}
