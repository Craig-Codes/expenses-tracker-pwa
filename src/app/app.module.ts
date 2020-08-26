import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from "angularx-social-login";
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  AmazonLoginProvider,
} from "angularx-social-login";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    SocialLoginModule,
    IonicModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              "368144912503-vfpr4p2goiel45uep19fkba73s5e2cp7.apps.googleusercontent.com"
              // https://console.developers.google.com/apis/credentials?folder=&organizationId=&project=geometric-orbit-287508 - lock down to site url!
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider("254906718841267"),
          },
          {
            id: AmazonLoginProvider.PROVIDER_ID,
            provider: new AmazonLoginProvider(
              "amzn1.application-oa2-client.f074ae67c0a146b6902cc0c4a3297935"
            ), // amzn1.application-oa2-client.d652e2c7f0964b00aef896f9100d96c6 - mine isn't working. Try once app has been deployed and lock down with web-hosted address!
          }, // amzn1.application-oa2-client.f074ae67c0a146b6902cc0c4a3297935
        ],
      } as SocialAuthServiceConfig,
    },
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
