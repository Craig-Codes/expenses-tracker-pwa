import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "src/app/data.service";
import { NavController } from "@ionic/angular";
import { map } from "rxjs/operators";

import { Trip } from "src/app/models/trip.model";
import { Receipt } from "src/app/models/reciept.model";

@Component({
  selector: "app-trip-details",
  templateUrl: "./trip-details.page.html",
  styleUrls: ["./trip-details.page.scss"],
})
export class TripDetailsPage implements OnInit, OnDestroy {
  tripToEdit: Trip[];
  tripId: string;
  currentReceipts: Receipt[];
  noReceiptFound: boolean;
  private tripSubscription: Subscription;
  private receiptsSubscription: Subscription;

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    // subscribe to any changes on the incoming route - using paraMap observable which contains route information
    this.route.paramMap.subscribe((paramMap) => {
      //check to make sure the route has a tripId param
      // console.log(paramMap);
      if (!paramMap.has("tripId")) {
        // throw an error - "no trip found, please try again" then navigate away
        this.navCtrl.navigateBack("/trips/tabs/all-trips");
        return;
      }
      this.isLoading = true;
      this.tripId = paramMap.get("tripId"); // get the id from the route params
      this.isLoading = true; // start the spinner whilst data is retrieved - as data is already in memory this shouldn't really be needed
      // whenever we get a new route, we get the latest behaviourSubject / value of the trips array in the dataService
      this.tripSubscription = this.dataService.trips
        .pipe(
          // the map rxjs operator is used to transform the recieved array into different data, re-mapping the data
          map((tripsArray) => {
            // console.log(tripsArray);
            this.tripToEdit = tripsArray.filter((trip) => {
              return trip.tripId === this.tripId;
            }); // use the array filter method to filter out the trip matching the trip.id taken from route params
          })
        )
        .subscribe(() => {
          // After trips have loaded I then need to fetch all recipts with the trip id and display them here...
          this.receiptsSubscription = this.dataService.reciepts
            .pipe(
              map((receiptsArray) => {
                this.currentReceipts = receiptsArray.filter((receipt) => {
                  return receipt.tripId === this.tripId;
                });
              })
            )
            .subscribe(() => {
              this.isLoading = false;
            });
        });
    });
  }

  ionViewWillEnter() {
    // sort the receipts, earlest date first
    this.currentReceipts.sort((a, b) => {
      if (a.timestamp < b.timestamp) return -1;
      if (a.timestamp > b.timestamp) return 1;
      return 0;
    });
  }

  ngOnDestroy() {
    if (this.receiptsSubscription) {
      this.receiptsSubscription.unsubscribe();
    }
    if (this.tripSubscription) {
      this.tripSubscription.unsubscribe();
    }
  }
}
