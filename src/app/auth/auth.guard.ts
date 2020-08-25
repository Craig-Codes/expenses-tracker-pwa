import { Injectable } from "@angular/core";
import { CanLoad, Route, UrlSegment, Router } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "../user.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanLoad {
  // guard is implemented before page is loaded!
  constructor(private userService: UserService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.userService.loggedIn) {
      this.router.navigateByUrl("/auth"); // if not logged in, navigate to auth page to log user in
    }
    return this.userService.loggedIn; // if true, code after the guard runs (we navigate successful). Must return a true boolean to continue to route
  }
}
