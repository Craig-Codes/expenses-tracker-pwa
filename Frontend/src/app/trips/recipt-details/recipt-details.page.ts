import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "src/app/data.service";
import { NavController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Receipt } from "src/app/models/reciept.model";

@Component({
  selector: "app-recipt-details",
  templateUrl: "./recipt-details.page.html",
  styleUrls: ["./recipt-details.page.scss"],
})
export class ReciptDetailsPage implements OnInit {
  isLoading = true;
  receiptTimeStamp: string; // stores the receipts time stamp which acts as it unique identifier
  receiptSubscription: Subscription; // get the latest array of all recepts from the data service
  receiptToEdit: Receipt[];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    // subscribe to any changes on the incoming route - using paraMap observable which contains route information
    this.route.paramMap.subscribe((paramMap) => {
      // console.log(paramMap);
      // check to make sure the route has a timeStamp param to identify the receipt
      if (!paramMap.has("timeStamp")) {
        // throw an error - "no trip found, please try again" then navigate away
        this.navCtrl.navigateBack("/trips/tabs/recipts");
        return;
      }
      this.isLoading = true;
      this.receiptTimeStamp = paramMap.get("timeStamp"); // get the timestamp from the route params
      this.isLoading = true; // start the spinner whilst data is retrieved - as data is already in memory this shouldn't really be needed
      // whenever we get a new route, we get the latest behaviourSubject / value of the trips array in the dataService
      this.receiptSubscription = this.dataService.reciepts
        .pipe(
          // the map rxjs operator is used to transform the recieved array into different data, re-mapping the data
          map((receiptsArray) => {
            this.receiptToEdit = receiptsArray.filter((receipt) => {
              return receipt.timestamp.toString() === this.receiptTimeStamp;
            }); // use the array filter method to filter out the trip matching the trip.id taken from route params
          })
        )
        .subscribe(() => {
          // we now have the necessary Trip information, remove loading spinner.
          this.isLoading = false;
          // console.log(this.receiptToEdit[0]);
        });
    });
  }
}
