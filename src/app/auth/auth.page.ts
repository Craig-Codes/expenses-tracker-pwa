import { Component, OnInit } from "@angular/core";

import { SocialAuthService } from "angularx-social-login";

import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  AmazonLoginProvider,
} from "angularx-social-login";
import { UserService } from "../user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  constructor(
    private authService: SocialAuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.userService.user = user;
      this.userService.loggedIn = user != null;
      console.log(this.userService.loggedIn);
      console.log(this.userService.user);
      if (this.userService.loggedIn === true) {
        this.router.navigate(["/", "trips", "tabs", "all-trips"]); ///trips/tabs/all-trips
      }
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signInWithAmazon(): void {
    this.authService.signIn(AmazonLoginProvider.PROVIDER_ID);
  }
}
