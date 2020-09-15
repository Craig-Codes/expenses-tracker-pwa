import { Component, OnInit, OnDestroy } from "@angular/core";
import { SegmentChangeEventDetail } from "@ionic/core";
import { DataService } from "../../data.service";
import { Trip } from "../../models/trip.model";
import { Subscription } from "rxjs";
import { UserService } from "src/app/user.service";
import { Receipt } from "src/app/models/reciept.model";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-all-trips",
  templateUrl: "./all-trips.page.html",
  styleUrls: ["./all-trips.page.scss"],
})
export class AllTripsPage implements OnInit, OnDestroy {
  constructor(
    private dataService: DataService,
    private userService: UserService,
    private loadingCtrl: LoadingController
  ) {}

  private retrievedTrips: Trip[]; // array of all the trips recieved from the data service
  private tabsValue = "cost"; // stores tab value, either cost or date, to be used for trip filtering
  orderedTrips: Trip[]; // array of trips ordered correctly, either by price or date
  userPhoto: string; // stores URL of users profile image
  totalToClaim: number; // stores the total claim amount for all trips
  isLoading = false; // boolean used to display a loading spinner
  noTripsFound = false; // boolean used to display a message for when the user has no trips yet

  firstTimeLoadFlag = false; // if false, male http requests to server to get data

  private tripsSubscription: Subscription; // subscription to the data service _trips behaviour subject.
  // Used to alwatys get the correct array of trips for an individual user

  async ngOnInit() {
    this.isLoading = true; // add a loading spinner whilst wait for api query and data service
    this.userPhoto = this.userService.user.photoURL; // set the users photo in the navbar based on the retreived user in the userService - Oauth is required for this to work!
    this.noTripsFound = true; // until trips are located, we assume no trips are found

    // Subscribe to any changes on the trips array inside the data service. This service always contains the state of the trips array
    this.tripsSubscription = this.dataService.trips.subscribe((tripsArray) => {
      if (tripsArray.length === 0) {
        this.noTripsFound = true;
        //  this.isLoading = false;
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
        this.isLoading = false; // once all tasks are complete, remove the loading spinner);
      }
    });

    if (this.firstTimeLoadFlag === false) {
      console.log(
        "first time page has loaded, make http requests to get starting data"
      );
      // create a modal letting user know we are fetching initial data
      const loading = await this.loadingCtrl.create({
        message:
          "Fetching initial data, please wait... This application is currently hosted on a free Heroku server," +
          "meaning that the server must wake up before data can be fetched." +
          "Please allow 30 seconds for this process if the application has not been used in over an hour as the server will be sleeping.",
      });
      loading.present();

      this.isLoading = true;
      this.dataService.getInitialDataTrips().subscribe((returnedTrips) => {
        console.log("retrieved initial trips");
        const usersTripArray: Trip[] = [];
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
      });

      this.dataService
        .getInitialDataReceipts()
        .subscribe((returnedReciepts) => {
          const usersRecieptArray: Receipt[] = [];
          returnedReciepts.forEach((reciept) => {
            console.log(reciept);
            let createdReceipt = new Receipt(
              reciept.user,
              reciept.tripId,
              reciept.image,
              reciept.price,
              reciept.timestamp
            );
            usersRecieptArray.push(createdReceipt);
          });
          this.dataService.getInitialReciepts(usersRecieptArray);
          this.isLoading = false;
          this.firstTimeLoadFlag = true; // http requests will not be made when we go to this page anymore, and the loading controlled will not appear telling users about the server
          setTimeout(() => {
            loading.dismiss();
          }, 1000);
        });
    }
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
      this.orderedTrips.sort((a, b) => {
        // https://masteringjs.io/tutorials/fundamentals/compare-dates - read this if dates not working correctly
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

  // Calculate the total amount owed from all trips - loop through the array and add the total to a variable for output. This method is called each time a trip is updated via subscriptions
  calculateTotal(trips: Trip[]) {
    this.totalToClaim = 0;
    trips.forEach((trip) => {
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
