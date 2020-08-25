import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { Plugins, Capacitor } from "@capacitor/core";
import { UserService } from "./user.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(private platform: Platform, private userService: UserService) {
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
    this.userService.signOut();
  }
}
