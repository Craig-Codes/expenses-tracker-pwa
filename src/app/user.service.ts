import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { cfaSignOut } from "capacitor-firebase-auth";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class UserService implements OnInit {
  private _user: any; // stores the user's login information gained from firebase logon
  loggedIn: boolean = false;

  constructor(private router: Router, public angularFire: AngularFireAuth) {}

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
    cfaSignOut().subscribe(() => {
      this.user = null;
      this.loggedIn = false;
      window.location.replace("/auth");
    });
  }
}
