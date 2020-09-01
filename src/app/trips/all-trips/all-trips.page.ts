import { Component, OnInit, OnDestroy } from "@angular/core";
import { SegmentChangeEventDetail } from "@ionic/core";
import { DataService } from "../../data.service";
import { Trip } from "../../models/trip.model";
import { Subscription } from "rxjs";
import { UserService } from "src/app/user.service";
import { HttpClient, HttpParams } from "@angular/common/http";

@Component({
  selector: "app-all-trips",
  templateUrl: "./all-trips.page.html",
  styleUrls: ["./all-trips.page.scss"],
})
export class AllTripsPage implements OnInit, OnDestroy {
  constructor(
    private dataService: DataService,
    private userService: UserService,
    private http: HttpClient
  ) {}
  retrievedTrips: Trip[];
  orderedTrips: Trip[];
  private tabsValue = "cost";
  userPhoto: string;

  totalToClaim: number;

  isLoading = false;
  noTripsFound = false; // boolean used to dispay a message for when the user has no trips yet

  private tripsSubscription: Subscription;

  ngOnInit() {
    // set the users photo in the navbar based on the retreived user in the userService - Oauth is required for this to work!
    this.userPhoto = this.userService.user.photoURL;
    this.noTripsFound = true; // until trips are located, we assume no trips are found
    // Subscribe to any changes on the trips array inside the data service. This service always contains the state of the trips array
    this.tripsSubscription = this.dataService.trips.subscribe((tripsArray) => {
      if (tripsArray.length === 0) {
        this.noTripsFound = true;
        return;
      } else {
        this.noTripsFound = false;
        this.retrievedTrips = tripsArray;
        // orderedTrips array needs to be a seperate array in memory, so slice creates a brand new array, no longer sharing a pointer to heap memory (arrays / objects are reference types)
        this.orderedTrips = this.retrievedTrips.slice(0);
        // each time we get an update to the array we need to re-order - firstly get the tab value, then call the onFilterLoad method to filter the tripsArray
        this.tabsValue = document.querySelector("ion-segment").value;
        this.onFilterLoad(this.tabsValue);
        // workout the total amount of money to be claimed
        this.calculateTotal(tripsArray);
        this.isLoading = false; // once all tasks are complete, remove the loading spinner
      }
    });
    this.isLoading = true; // add a loading spinner whilst wait for api query and data service
    let params = new HttpParams().set("user", this.userService.user.email);
    this.http
      .get<any[]>(`http://localhost:3000/trips`, { params })
      .subscribe((returnedTrips) => {
        console.log("returnedTrips ======", this.retrievedTrips);
        if (returnedTrips.length === 0) {
          // if array is empty, no trips were returned so we have no starting trips for this user
          this.noTripsFound = true; // add a message to let user know to create a trip to store reciepts as most likely a new user
          this.isLoading = false; // no longer need to load, as nothing to actually load
          return;
        } else {
          const usersTripArray: Trip[] = [];
          console.log(returnedTrips);
          returnedTrips.forEach((trip) => {
            console.log(trip);
            let createdTrip = new Trip(
              trip.user,
              trip.tripId,
              trip.location,
              trip.description,
              trip.dateFrom,
              trip.dateTo,
              trip.amount
            );
            usersTripArray.push(createdTrip);
          });
          this.dataService.getInitialTrips(usersTripArray);
        }
      });
  }

  ionViewWillEnter() {
    console.log("entering view");
    // console.log(this.userService.user.user.email);
    // console.log(this.userService.user);
    console.log("firebase user", this.userService.user);
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    try {
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
    } catch {
      // if no trips then we dont want to sort. Catch the error
      console.log("no trips to sort");
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
