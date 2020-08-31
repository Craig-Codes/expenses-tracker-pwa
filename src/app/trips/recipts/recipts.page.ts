import { Component, OnInit } from "@angular/core";
import { SegmentChangeEventDetail } from "@ionic/core";
import { UserService } from "src/app/user.service";

@Component({
  selector: "app-recipts",
  templateUrl: "./recipts.page.html",
  styleUrls: ["./recipts.page.scss"],
})
export class ReciptsPage implements OnInit {
  userPhoto: string;
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userPhoto = this.userService.user.photoURL;
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === "recent") {
      console.log("most recent");
    } else {
      console.log("cost");
    }
  }
}
