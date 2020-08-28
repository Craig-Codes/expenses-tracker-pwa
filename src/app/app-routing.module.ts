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
    loadChildren: () =>
      import("../app/trips/trip-details/trip-details.module").then(
        (m) => m.TripDetailsPageModule
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
