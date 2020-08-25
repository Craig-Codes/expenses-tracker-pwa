import { Injectable, OnInit } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UserService implements OnInit {
  // user: SocialUser;
  loggedIn: boolean;

  constructor() {}

  ngOnInit() {}
}
