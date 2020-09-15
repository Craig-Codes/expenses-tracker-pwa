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
  submitError: string;
  authRedirectResult: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
    public angularFire: AngularFireAuth // required to setup the google authentication connection
  ) {}

  ngOnInit() {}

  signInWithGoogleNative() {
    cfaSignIn("google.com").subscribe((user: User) => {
      this.signInRedirect(user);
    });
  }

  signInWithFacebookNative() {
    cfaSignIn("facebook.com").subscribe((user: User) => {
      this.signInRedirect(user);
    });
  }

  signInWithTwitterNative() {
    cfaSignIn("twitter.com").subscribe((user: User) => {
      this.signInRedirect(user);
    });
  }

  signInRedirect(user: User) {
    this.userService.user = user;
    // assign the user service user to the sign in fetched user profile via firebase
    if (this.userService.user) {
      // if the user has a value, set the loggedIn property to true so that the authguard will allow the redirect
      this.userService.loggedIn = true;
      this.router.navigate(["/trips/tabs/all-trips"]);
    }
  }
}
