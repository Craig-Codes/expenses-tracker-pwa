import { Injectable, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";

import { Router } from "@angular/router";
import { ProfileModel } from "./models/profile.model";
import { Observable } from "rxjs/internal/Observable";
import { from } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService implements OnInit {
  constructor(private router: Router, public angularFire: AngularFireAuth) {}
  private _user: ProfileModel; // stores the user's login information gained from angularx-social-login SocialAuthService
  loggedIn: boolean = false;

  ngOnInit() {}

  // _user can only get accessed from inside this class using getter and setter.
  get user() {
    return this._user;
  }

  set user(userData: ProfileModel) {
    console.log(userData);
    this._user = userData;
  }

  signOut(): Observable<any> {
    return from(this.angularFire.signOut());
  }
}
