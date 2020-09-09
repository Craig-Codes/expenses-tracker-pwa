import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReciptsEditPage } from './recipts-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ReciptsEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReciptsEditPageRoutingModule {}
