import { Component, OnInit } from "@angular/core";
import { SegmentChangeEventDetail } from "@ionic/core";

@Component({
  selector: "app-recipts",
  templateUrl: "./recipts.page.html",
  styleUrls: ["./recipts.page.scss"],
})
export class ReciptsPage implements OnInit {
  constructor() {}

  ngOnInit() {}

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === "recent") {
      console.log("most recent");
    } else {
      console.log("cost");
    }
  }
}
