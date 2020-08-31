import { Injectable, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";

import { Router } from "@angular/router";
import { FirebaseAuthService } from "./auth/firebase-auth.service";
import { cfaSignOut } from "capacitor-firebase-auth";

@Injectable({
  providedIn: "root",
})
export class UserService implements OnInit {
  constructor(
    private router: Router,
    public angularFire: AngularFireAuth,
    private firebaseAuthService: FirebaseAuthService
  ) {}
  private _user: any; // stores the user's login information gained from firebase logon
  loggedIn: boolean = false;

  ngOnInit() {}

  // _user can only get accessed from inside this class using getter and setter.
  get user() {
    return this._user;
  }

  set user(userData: any) {
    console.log(userData);
    this._user = userData;
  }

  signOut() {
    console.log("hit sign-out");
    // this.user = null;
    // this.firebaseAuthService.currentUser = null;
    // this.loggedIn = false;
    // console.log(
    //   "current user at logout ======",
    //   this.firebaseAuthService.currentUser
    // );
    // this.router.navigate(["auth"]);

    cfaSignOut().subscribe(() => {
      this.user = null;
      this.firebaseAuthService.currentUser = null;
      this.loggedIn = false;
      this.router.navigate(["auth"]);
    });
  }
}
