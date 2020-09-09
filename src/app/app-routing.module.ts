import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "trips",
    pathMatch: "full",
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./auth/auth.module").then((m) => m.AuthPageModule),
  },
  {
    path: "trips",
    canLoad: [AuthGuard], // route is protected by a guard, which must return a positive boolean to proceed to load route
    loadChildren: () =>
      import("./trips/trips.module").then((m) => m.TripsPageModule),
  },
  {
    path: "trip-new",
    canLoad: [AuthGuard],
    loadChildren: () =>
      import("../app/trips/trip-new/trip-new.module").then(
        (m) => m.TripNewPageModule
      ),
  },
  {
    path: "trip-edit/:tripId",
    canLoad: [AuthGuard],
    loadChildren: () =>
      import("../app/trips/trip-edit/trip-edit.module").then(
        (m) => m.TripEditPageModule
      ),
  },
  {
    path: "trip-details/:tripId",
    canLoad: [AuthGuard],
    loadChildren: () =>
      import("../app/trips/trip-details/trip-details.module").then(
        (m) => m.TripDetailsPageModule
      ),
  },
  {
    path: "recipt-details/:timeStamp",
    canLoad: [AuthGuard],
    loadChildren: () =>
      import("../app/trips/recipt-details/recipt-details.module").then(
        (m) => m.ReciptDetailsPageModule
      ),
  },
  {
    path: "recipts-edit/:timeStamp",
    canLoad: [AuthGuard],
    loadChildren: () =>
      import("../app/trips/recipts-edit/recipts-edit.module").then(
        (m) => m.ReciptsEditPageModule
      ),
  },
  {
    path: "recipt-new/:tripId",
    canLoad: [AuthGuard],
    loadChildren: () =>
      import("../app/trips/recipt-new/recipt-new.module").then(
        (m) => m.ReciptNewPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
