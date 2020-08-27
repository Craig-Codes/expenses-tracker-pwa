import { Injectable, OnInit } from "@angular/core";

import { SocialAuthService } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class UserService implements OnInit {
  constructor(private authService: SocialAuthService, private router: Router) {}
  private _user: SocialUser; // stores the user's login information gained from angularx-social-login SocialAuthService
  loggedIn: boolean = false;

  ngOnInit() {}

  // _user can only get accessed from inside this class using getter and setter.
  get user() {
    return this._user;
  }

  set user(userData: SocialUser) {
    this._user = userData;
  }

  signOut(): void {
    this.authService.signOut();
    this.router.navigate(["/", "auth"]);
    console.log(this._user);
  }
}
