import { Component, OnInit } from "@angular/core";
import { SegmentChangeEventDetail } from "@ionic/core";
import { UserService } from "src/app/user.service";
import { DataService } from "src/app/data.service";
import { Receipt } from "src/app/models/reciept.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-recipts",
  templateUrl: "./recipts.page.html",
  styleUrls: ["./recipts.page.scss"],
})
export class ReciptsPage implements OnInit {
  userPhoto: string;
  constructor(
    private dataService: DataService,
    private userService: UserService
  ) {}
  private retrievedReciepts: Receipt[]; // array of all the trips recieved from the data service
  private tabsValue = "cost"; // stores tab value, either cost or date, to be used for trip filtering
  orderedReciepts: Receipt[]; // array of trips ordered correctly, either by price or date
  usersPhoto: string; // stores URL of users profile image
  totalToClaim: number; // stores the total claim amount for all trips
  isLoading = false; // boolean used to display a loading spinner
  noRecieptsFound = false; // boolean used to display a message for when the user has no trips yet

  private recieptsSubscription: Subscription; // subscription to the data service _reciepts behaviour subject.
  // Used to alwatys get the correct array of reciepts for an individual user

  ngOnInit() {
    this.isLoading = true; // add a loading spinner whilst wait for api query and data service
    this.usersPhoto = this.userService.user.photoURL; // set the users photo in the navbar based on the retreived user in the userService - Oauth is required for this to work!
    this.noRecieptsFound = true; // until receipts are located, we assume no reciepts are found

    this.recieptsSubscription = this.dataService.reciepts.subscribe(
      (recieptsArray) => {
        if (recieptsArray.length === 0) {
          this.noRecieptsFound = true;
          this.isLoading = false;
          return;
        } else {
          this.noRecieptsFound = false;
          this.retrievedReciepts = recieptsArray;
          // orderedTrips array needs to be a seperate array in memory, so slice creates a brand new array, no longer sharing a pointer to heap memory (arrays / objects are reference types)
          this.orderedReciepts = this.retrievedReciepts.slice(0);
          // each time we get an update to the array we need to re-order - firstly get the tab value, then call the onFilterLoad method to filter the tripsArray
          this.tabsValue = document.querySelector("ion-segment").value;
          this.onFilterLoad(this.tabsValue);
          // workout the total amount of money to be claimed
          this.calculateTotal(recieptsArray);
          this.isLoading = false; // once all tasks are complete, remove the loading spinner);
        }
      }
    );
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    try {
      if (event.detail.value === "recent") {
        this.orderedReciepts.sort((a, b) => {
          if (a.timestamp < b.timestamp) return 1;
          if (a.timestamp > b.timestamp) return -1;
          return 0;
        });
      } else {
        this.orderedReciepts.sort((a, b) => {
          if (a.price < b.price) return 1;
          if (a.price > b.price) return -1;
          return 0;
        });
      }
    } catch {
      // if no trips then we dont want to sort. Catch the error
    }
  }

  onFilterLoad(value: string) {
    if (value === "recent") {
      this.orderedReciepts.sort((a, b) => {
        // https://masteringjs.io/tutorials/fundamentals/compare-dates - read this if dates not working correctly
        if (a.timestamp < b.timestamp) return 1;
        if (a.timestamp > b.timestamp) return -1;
        return 0;
      });
    } else {
      this.orderedReciepts.sort((a, b) => {
        if (a.price < b.price) return 1;
        if (a.price > b.price) return -1;
        return 0;
      });
    }
  }

  // Calculate the total amount owed from all trips - loop through the array and add the total to a variable for output. This method is called each time a trip is updated via subscriptions
  calculateTotal(reciepts: Receipt[]) {
    this.totalToClaim = 0;
    reciepts.forEach((reciept) => {
      this.totalToClaim += reciept.price;
    });
  }

  ngOnDestroy() {
    // If we have an active subscription, it should be removed to prevent any memory leak
    if (this.recieptsSubscription) {
      this.recieptsSubscription.unsubscribe();
    }
  }
}
