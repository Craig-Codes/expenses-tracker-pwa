import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { Subscription } from "rxjs/internal/Subscription";

import { cfaSignIn } from "capacitor-firebase-auth";
import { User } from "firebase";
import { AlertController } from "@ionic/angular";

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
    public angularFire: AngularFireAuth, // required to setup the google authentication connection
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  async signIn(provider: string) {
    cfaSignIn(provider).subscribe(
      (user: User) => {
        this.signInRedirect(user);
      },
      (err) => {
        this.presentAlert(err.message);
      }
    );
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

  async presentAlert(errorMessage) {
    let alert = await this.alertCtrl.create({
      header: "Error",
      message: errorMessage,
      buttons: ["Ok"],
    });
    alert.present();
  }
}
