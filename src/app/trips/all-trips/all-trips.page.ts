import { Component, OnInit } from "@angular/core";
import { SegmentChangeEventDetail } from "@ionic/core";

@Component({
  selector: "app-all-trips",
  templateUrl: "./all-trips.page.html",
  styleUrls: ["./all-trips.page.scss"],
})
export class AllTripsPage implements OnInit {
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
