import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DataService } from "../../data.service";
import { UserService } from "../../user.service";

@Component({
  selector: "app-trip-new",
  templateUrl: "./trip-new.page.html",
  styleUrls: ["./trip-new.page.scss"],
})
export class TripNewPage implements OnInit {
  form: FormGroup;
  newTrip: any = {}; // variable to hold the new trip data
  minYear: string;
  maxYear: string;
  dateError = true;
  dateMessage = false;

  constructor(
    private dataService: DataService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.minYear = (new Date().getFullYear() - 1).toString();
    this.maxYear = (
      new Date().getFullYear() +
      1 +
      "-" +
      new Date().getMonth() +
      1 +
      "-" +
      new Date().getDate()
    ).toString();

    // create the reactive form
    this.form = new FormGroup({
      location: new FormControl(null, {
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(180),
          Validators.minLength(1),
        ],
      }),
      dateFrom: new FormControl(null, {
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  onAddTrip() {
    this.newTrip.user = this.userService.user.email;
    this.newTrip.location = this.form.value.location;
    this.newTrip.description = this.form.value.description;
    this.newTrip.dateFrom = this.form.value.dateFrom;
    this.newTrip.dateTo = this.form.value.dateTo;
    this.newTrip.tripId = this.idGenerator(
      this.newTrip.location,
      this.newTrip.description,
      this.newTrip.dateFrom,
      this.newTrip.dateTo
    );
    this.newTrip.price = 0; // always start at 0, this then changes when receipts are added / removed
    this.dataService.newTrip(this.newTrip);
  }

  idGenerator(
    location: string,
    description: string,
    dateFrom: Date,
    dateTo: Date
  ) {
    let tripId: string = "";
    const locationData = location.substring(0, 3);
    const descriptionData = description.substring(0, 1);
    const dateFromConversion = dateFrom.toString();
    const dateFromData = dateFromConversion.substring(0, 12);
    const dateToConversion = dateTo.toString();
    const dateToData = dateToConversion.substring(0, 12);

    tripId = locationData + descriptionData + dateFromData + dateToData;
    return tripId; // returns a complex id made up of inputted data
  }

  compareTwoDates() {
    // Get the dates from the input. Slice the first 10 characters so we don't get the minutes, this isnt necessary and causes bugs
    try {
      if (
        this.form.value.dateFrom.slice(0, 10) >
          this.form.value.dateTo.slice(0, 10) ||
        this.form.value.dateFrom === null
      ) {
        this.dateError = true;
        this.dateMessage = true;
      } else {
        this.dateError = false;
        this.dateMessage = false;
      }
    } catch {
      // catch the error to stop it throwing in the console
    }
  }
}
