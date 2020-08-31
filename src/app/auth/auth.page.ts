import { Component, OnInit } from "@angular/core";

import { UserService } from "../user.service";
import { Router } from "@angular/router";

import { AngularFireAuth } from "@angular/fire/auth";
import { Subscription } from "rxjs/internal/Subscription";

import { cfaSignIn } from "capacitor-firebase-auth";
import { User } from "firebase";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  // signInForm: FormGroup;
  submitError: string;
  authRedirectResult: Subscription;
  // redirectSpinner: boolean = true;

  constructor(
    private userService: UserService,
    private router: Router,
    public angularFire: AngularFireAuth // required to setup the google authentication connection
  ) {}

  ngOnInit() {}

  signInWithGoogleNative() {
    console.log("native sign in try");
    cfaSignIn("google.com").subscribe((user: User) => {
      console.log(user.displayName);
      this.userService.user = user;
      console.log(this.userService.user);
      if (this.userService.user) {
        this.userService.loggedIn = true;
        console.log("user is real, proceed");
        this.router.navigate(["/trips/tabs/all-trips"]);
      }
    });
  }

  signInWithFacebookNative() {
    console.log("native sign in try");
    cfaSignIn("facebook.com").subscribe((user: User) => {
      console.log(user.displayName);
      this.userService.user = user;
      console.log(this.userService.user);
      if (this.userService.user) {
        this.userService.loggedIn = true;
        console.log("user is real, proceed");
        this.router.navigate(["/trips/tabs/all-trips"]);
      }
    });
  }

  signInWithTwitterNative() {
    console.log("native sign in try");
    cfaSignIn("twitter.com").subscribe((user: User) => {
      console.log(user.displayName);
      this.userService.user = user;
      console.log(this.userService.user);
      if (this.userService.user) {
        this.userService.loggedIn = true;
        console.log("user is real, proceed");
        this.router.navigate(["/trips/tabs/all-trips"]);
      }
    });
  }
}
