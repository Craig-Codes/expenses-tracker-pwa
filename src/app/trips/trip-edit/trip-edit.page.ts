import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Trip } from "../../models/trip.model";
import { DataService } from "../../data.service";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { NavController, AlertController } from "@ionic/angular";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";

@Component({
  selector: "app-trip-edit",
  templateUrl: "./trip-edit.page.html",
  styleUrls: ["./trip-edit.page.scss"],
})
export class TripEditPage implements OnInit, OnDestroy {
  tripToEdit: any[]; // uses the route params to filter the data service trips observable so that only the selected trip is displayed
  tripId: string;
  private tripSubscription: Subscription;

  isLoading = false;

  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    // subscribe to any changes on the incoming route - using paraMap observable which contains route information
    this.route.paramMap.subscribe((paramMap) => {
      //check to make sure the route has a tripId param
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
            this.tripToEdit = tripsArray.filter((trip) => {
              return trip.tripId === this.tripId;
            }); // use the array filter method to filter out the trip matching the trip.id taken from route params
          })
        )
        .subscribe(() => {
          this.isLoading = false; // we now have the necessary Trip information, remove loading spinner.
        });
    });

    // create the reactive form
    this.form = new FormGroup({
      location: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      dateFrom: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
    });

    // pre-populate the form
    this.form.get("location").setValue(this.tripToEdit[0].location);
    this.form.get("description").setValue(this.tripToEdit[0].description);
    this.form.get("dateFrom").setValue(this.tripToEdit[0].dateFrom);
    this.form.get("dateTo").setValue(this.tripToEdit[0].dateTo);
  }

  onUpdateTrip() {
    console.log("updating trip...");
    // ensure the form is valid
    if (!this.form.valid) {
      return;
    }
    // if no change in the form, navigate away without making a http request
    if (
      this.tripToEdit[0].location === this.form.value.location &&
      this.tripToEdit[0].description === this.form.value.description &&
      this.tripToEdit[0].dateFrom === this.form.value.dateFrom &&
      this.tripToEdit[0].dateTo === this.form.value.dateTo
    ) {
      this.router.navigate(["/trips/tabs/all-trips"]);
      return;
    } else {
      // change the trip values to the ones reflected in the form data
      this.tripToEdit[0].location = this.form.value.location;
      this.tripToEdit[0].description = this.form.value.description;
      this.tripToEdit[0].dateFrom = this.form.value.dateFrom;
      this.tripToEdit[0].dateTo = this.form.value.dateTo;
      // For the database we need the date in the correct format (ISO) so that it can be stored and retreived correctly.
      this.tripToEdit[0].dateFromAsDate = new Date(this.form.value.dateFrom);
      this.tripToEdit[0].dateToAsDate = new Date(this.form.value.dateTo);
      // send updated trip to the dataService to update the _trips array and emit to all subscribed components
      this.dataService.editTrip(this.tripToEdit[0]);
    }
  }

  onDeleteTrip() {
    // modal - allows user to check they really want to delete the trip
    this.alertCtrl
      .create({
        header: "Delete trip?",
        message:
          "Are you sure? Deleting the trip will remove all associated receipts and cannot be undone.",
        buttons: [
          {
            text: "Okay",
            handler: () => {
              this.dataService.deleteTrip(this.tripId);
            },
          },
          {
            text: "Cancel",
            handler: () => {
              console.log("cancelled delete");
            },
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  ngOnDestroy() {
    this.tripSubscription.unsubscribe();
  }
}
