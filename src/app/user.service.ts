import { Injectable, OnInit } from "@angular/core";
import { SocialUser } from "angularx-social-login";

@Injectable({
  providedIn: "root",
})
export class UserService implements OnInit {
  user: SocialUser;
  loggedIn: boolean;

  constructor() {}

  ngOnInit() {}
}
