import { Component, OnInit, OnDestroy } from "@angular/core";
import { SegmentChangeEventDetail } from "@ionic/core";
import { DataService } from "../../data.service";
import { Trip } from "../../models/trip.model";
import { Subscription } from "rxjs";
import { UserService } from "src/app/user.service";

@Component({
  selector: "app-all-trips",
  templateUrl: "./all-trips.page.html",
  styleUrls: ["./all-trips.page.scss"],
})
export class AllTripsPage implements OnInit, OnDestroy {
  constructor(
    private dataService: DataService,
    private userService: UserService
  ) {}
  retrievedTrips: Trip[];
  orderedTrips: Trip[];
  private tabsValue = "cost";

  totalToClaim: number;

  isLoading = false;

  private tripsSubscription: Subscription;

  ngOnInit() {
    // start with relevant trips being ordered by Date
    this.tripsSubscription = this.dataService.trips.subscribe((tripsArray) => {
      this.isLoading = true; // add a loading spinner
      setTimeout(() => {
        // faking a slow api response to see spinner - remove once db is setup!
        this.retrievedTrips = tripsArray;
        // orderedTrips array needs to be a seperate array in memory
        this.orderedTrips = this.retrievedTrips.slice(0);
        // each time we get an update to the array we need to re-order - firstly get the tab value, then call the onFilterLoad method to filter the tripsArray
        this.tabsValue = document.querySelector("ion-segment").value;
        this.onFilterLoad(this.tabsValue);
        // workout the total amount of money to be claimed
        this.calculateTotal(tripsArray);
        this.isLoading = false; // once all tasks are complete, remove the loading spinner
      }, 2000);
    });
  }

  ionViewWillEnter() {
    console.log("entering view");
    // console.log(this.userService.user.user.email);
    // console.log(this.userService.user);
    console.log("firebase user", this.userService.user);
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log("filtering");
    if (event.detail.value === "recent") {
      this.orderedTrips.sort((a, b) => {
        if (a.dateFrom < b.dateFrom) return 1;
        if (a.dateFrom > b.dateFrom) return -1;
        return 0;
      });
    } else {
      this.orderedTrips.sort((a, b) => {
        if (a.price < b.price) return 1;
        if (a.price > b.price) return -1;
        return 0;
      });
    }
  }

  onFilterLoad(value: string) {
    if (value === "recent") {
      console.log("most recent");
      this.orderedTrips.sort((a, b) => {
        if (a.dateFrom < b.dateFrom) return 1;
        if (a.dateFrom > b.dateFrom) return -1;
        return 0;
      });
    } else {
      console.log("cost");
      this.orderedTrips.sort((a, b) => {
        if (a.price < b.price) return 1;
        if (a.price > b.price) return -1;
        return 0;
      });
    }
  }

  updateTest() {
    console.log("upadte test pressed");
    this.dataService.updateTrip(
      "craig_adam2k@hotmail.com",
      "tor20200312",
      "Toronto",
      "Messing up the Raptors!",
      new Date("2010-03-30"),
      new Date("2018-03-30"),
      4000
    );
  }

  // Calculate the total amoutn owed from all trips - loop through the array and add the total to a variable for output. This method is called each time a trip is updated via subscriptions
  calculateTotal(trips: Trip[]) {
    this.totalToClaim = 0;
    trips.forEach((trip) => {
      console.log(trip);
      this.totalToClaim += trip.price;
    });
  }

  ngOnDestroy() {
    // If we have an active subscription, it should be removed to prevent any memory leak
    if (this.tripsSubscription) {
      this.tripsSubscription.unsubscribe();
    }
  }
}
