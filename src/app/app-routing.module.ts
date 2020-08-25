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
    path: "trips",
    canLoad: [AuthGuard], // route is protected by a guard, which must return a positive boolean to proceed to load route
    loadChildren: () =>
      import("./trips/trips.module").then((m) => m.TripsPageModule),
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./auth/auth.module").then((m) => m.AuthPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
