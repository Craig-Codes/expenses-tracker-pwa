import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Receipt } from "../../models/reciept.model";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from "../../data.service";
import { NavController } from "@ionic/angular";
import { map } from "rxjs/operators";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";

@Component({
  selector: "app-recipts-edit",
  templateUrl: "./recipts-edit.page.html",
  styleUrls: ["./recipts-edit.page.scss"],
})
export class ReciptsEditPage implements OnInit {
  isLoading = true;
  receiptTimeStamp: string; // stores the receipts time stamp which acts as it unique identifier
  receiptSubscription: Subscription; // get the latest array of all recepts from the data service
  receiptToEdit: Receipt[];

  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    // subscribe to any changes on the incoming route - using paraMap observable which contains route information
    this.route.paramMap.subscribe((paramMap) => {
      console.log(paramMap);
      // check to make sure the route has a timeStamp param to identify the receipt
      if (!paramMap.has("timeStamp")) {
        // throw an error - "no trip found, please try again" then navigate away
        this.navCtrl.navigateBack("/trips/tabs/recipts");
        return;
      }
      this.isLoading = true;
      this.receiptTimeStamp = paramMap.get("timeStamp"); // get the timestamp from the route params
      console.log(this.receiptTimeStamp);
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
        });
    });

    // create the reactive form
    this.form = new FormGroup({
      // We use patch Value on this form control once we have an image so that its updated!
      price: new FormControl(null, {
        updateOn: "blur",
        validators: [
          Validators.required,
          Validators.maxLength(7),
          Validators.minLength(1),
        ],
      }),
    });

    // pre-populate the form
    this.form.get("price").setValue(this.receiptToEdit[0].price);
  }

  onUpdateReceipt() {
    if (this.receiptToEdit[0].price === this.form.value.price) {
      // if the price has not changed, simply navigate back. Check is here to reduce API calls
      this.router.navigate(["/trips/tabs/all-trips"]);
    } else {
      this.receiptToEdit[0].price = this.form.value.price; // update the receipt with new price
      // pass in the receipt to the data service edit receipt method
      this.dataService.editReceipt(this.receiptToEdit[0]);
    }
  }

  onDeleteReceipt() {
    this.dataService.deleteReceipt(this.receiptToEdit[0]);
  }
}
