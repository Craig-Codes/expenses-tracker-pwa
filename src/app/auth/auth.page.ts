import { Component, OnInit, NgZone } from "@angular/core";

import { UserService } from "../user.service";
import { Router } from "@angular/router";

import { AngularFireAuth } from "@angular/fire/auth";
import { FirebaseAuthService } from "../auth/firebase-auth.service";
import { Subscription } from "rxjs/internal/Subscription";

import { cfaSignIn } from "capacitor-firebase-auth";
import { User } from "firebase";
import { Platform } from "@ionic/angular";

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
    private ngZone: NgZone,
    private userService: UserService,
    private router: Router,
    public angularFire: AngularFireAuth,
    private authService: FirebaseAuthService,
    private platform: Platform
  ) {
    // Get firebase authentication redirect result invoken when using signInWithRedirect()
    // signInWithRedirect() is only used when client is in web but not desktop
    this.authRedirectResult = this.authService
      .getRedirectResult()
      .subscribe((result) => {
        this.userService.user = result;
        if (this.userService.user) {
          this.userService.loggedIn = true;
          this.redirectLoggedUserToProfilePage();
        } else if (result.error) {
          this.submitError = result.error;
        }
      });
  }

  // Once the auth provider finished the authentication flow, and the auth redirect completes,
  // redirect the user to the profile page
  redirectLoggedUserToProfilePage() {
    // As we are calling the Angular router navigation inside a subscribe method, the navigation will be triggered outside Angular zone.
    // That's why we need to wrap the router navigation call inside an ngZone wrapper
    this.ngZone.run(() => {
      this.router.navigate(["/trips/tabs/all-trips"]);
    });
  }

  ngOnInit() {
    console.log("Mobile:", this.platform.is("mobile"));
    console.log("Hybrid:", this.platform.is("hybrid"));
    console.log("iOS:", this.platform.is("ios"));
    console.log("Android:", this.platform.is("android"));
    console.log("Desktop:", this.platform.is("desktop"));
    console.log("core:", this.platform.is("core"));

    // setTimeout(() => {
    //   this.redirectSpinner = false;
    // }, 3000);
  }

  ionViewWillEnter() {}

  signInWithGoogle() {
    this.authService
      .signInWithGoogle()
      .then((result: any) => {
        if (result.additionalUserInfo) {
          this.authService.setProviderAdditionalInfo(
            result.additionalUserInfo.profile
          );
        }
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const token = result.credential.accessToken;
        // The signed-in user info is in result.user;
        this.redirectLoggedUserToProfilePage();
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error);
      });
  }

  signInWithFB() {
    this.authService
      .signInWithFacebook()
      .then((result: any) => {
        if (result.additionalUserInfo) {
          // to get all the sign in provider's information
          this.authService.setProviderAdditionalInfo(
            result.additionalUserInfo.profile
          );
        }
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        // const token = result.credential.accessToken;
        // The signed-in user info is in result.user;
        this.redirectLoggedUserToProfilePage();
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error);
      });
  }

  signInWithTwitter() {
    this.authService
      .signInWithTwitter()
      .then((result: any) => {
        if (result.additionalUserInfo) {
          this.authService.setProviderAdditionalInfo(
            result.additionalUserInfo.profile
          );
        }
        // This gives you a Twitter Access Token. You can use it to access the Twitter API.
        // const token = result.credential.accessToken;
        // The signed-in user info is in result.user;
        this.redirectLoggedUserToProfilePage();
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error);
      });
  }

  // GitHub not supported by native oAuth sign in package
  // signInWithGithub() {
  //   this.authService
  //     .signInWithGithub()
  //     .then((result: any) => {
  //       if (result.additionalUserInfo) {
  //         this.authService.setProviderAdditionalInfo(
  //           result.additionalUserInfo.profile
  //         );
  //       }
  //       // This gives you a Twitter Access Token. You can use it to access the Twitter API.
  //       // const token = result.credential.accessToken;
  //       // The signed-in user info is in result.user;
  //       this.redirectLoggedUserToProfilePage();
  //     })
  //     .catch((error) => {
  //       // Handle Errors here.
  //       console.log(error);
  //     });
  // }

  signInWithGoogleNative() {
    console.log("native sign in try");
    cfaSignIn("google.com").subscribe((user: User) => {
      console.log(user.displayName);
      this.authService.currentUser = user;
      console.log(this.authService.currentUser);
      if (this.authService.currentUser) {
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
      this.authService.currentUser = user;
      console.log(this.authService.currentUser);
      if (this.authService.currentUser) {
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
      this.authService.currentUser = user;
      console.log(this.authService.currentUser);
      if (this.authService.currentUser) {
        this.userService.loggedIn = true;
        console.log("user is real, proceed");
        this.router.navigate(["/trips/tabs/all-trips"]);
      }
    });
  }

  // GitHub not supported by native sign in library
  // signInWithGithubNative() {
  //   console.log("native sign in try");
  //   cfaSignIn("github.com").subscribe((user: User) => {
  //     console.log(user.displayName);
  //     this.authService.currentUser = user;
  //     console.log(this.authService.currentUser);
  //     if (this.authService.currentUser) {
  //       this.userService.loggedIn = true;
  //       console.log("user is real, proceed");
  //       this.router.navigate(["/trips/tabs/all-trips"]);
  //     }
  //   });
  // }
}
