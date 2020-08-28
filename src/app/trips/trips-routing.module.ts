import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { TripsPage } from "./trips.page";

const routes: Routes = [
  {
    path: "tabs",
    component: TripsPage,
    children: [
      {
        path: "recipts",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("./recipts/recipts.module").then(
                (m) => m.ReciptsPageModule
              ),
          },
        ],
      },
      {
        path: "all-trips",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("./all-trips/all-trips.module").then(
                (m) => m.AllTripsPageModule
              ),
          },
        ],
      },
    ],
  },
  {
    path: 'trip-edit',
    loadChildren: () => import('./trip-edit/trip-edit.module').then( m => m.TripEditPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripsPageRoutingModule {}
