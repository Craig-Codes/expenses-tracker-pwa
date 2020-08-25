import { Injectable, OnInit } from "@angular/core";

import { SocialAuthService } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class UserService implements OnInit {
  constructor(private authService: SocialAuthService, private router: Router) {}
  user: SocialUser;
  loggedIn: boolean;

  ngOnInit() {}

  signOut(): void {
    this.authService.signOut();
    this.router.navigate(["/", "auth"]);
  }
}
