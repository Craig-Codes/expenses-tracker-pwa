import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { Plugins, Capacitor } from "@capacitor/core";
import { UserService } from "./user.service";
import { FirebaseAuthService } from "./auth/firebase-auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private firebaseAuthService: FirebaseAuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable("SplashScreen")) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  onLogout() {
    console.log("Pressed");
    this.firebaseAuthService.signOut().subscribe(
      () => {
        // Sign-out successful.
        this.router.navigate(["/"]);
      },
      (error) => {
        console.log("signout error", error);
      }
    );
  }
}
