import { Injectable } from "@angular/core";
import { Trip } from "../app/models/trip.model";
import { Receipt } from "../app/models/recipt.model";
import { UserService } from "./user.service";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(private userService: UserService) {}
  // userService injected to get user user email - used in the API calls this.userservice.user.email = users logged in email addess

  // will hold an array of all fetched trips for a user from the db
  private _trips = new BehaviorSubject<Trip[]>([
    // new Trip(
    //   "craig_adam2k@hotmail.com",
    //   "lax20200312",
    //   "los Angeles",
    //   "best RAF course ever!!!!",
    //   new Date("2015-03-20"),
    //   new Date(),
    //   100
    // ),
    // new Trip(
    //   "craigadam1987@gmail.com",
    //   "jpn20200312",
    //   "Japan",
    //   "International Relations Exercise",
    //   new Date("2015-03-25"),
    //   new Date(),
    //   400
    // ),
    // new Trip(
    //   "craig_adam2k@hotmail.com",
    //   "rky20200312",
    //   "Iceland",
    //   "Satcomms course",
    //   new Date("2015-03-26"),
    //   new Date(),
    //   200
    // ),
  ]);

  get trips() {
    return this._trips.asObservable(); // can now be subscribed to from other componenets
  }

  // will hold an array of all the fetches recipts for a user from db
  private _recipts: Receipt[];

  getInitialTrips(initialTrips: Trip[]) {
    // would fetch trips from the server... based on user email address
    this._trips.next(initialTrips);
    //return this._trips;
  }

  getRecipts() {
    return this._recipts;
  }

  updateTrip(
    user: string,
    tripId: string,
    location: string,
    description: string,
    dateFrom: Date,
    dateTo: Date,
    price: number
  ) {
    // Create a new Trip object
    let newTrip = new Trip(
      user,
      tripId,
      location,
      description,
      dateFrom,
      dateTo,
      price
    );
    // emit a value on the this._trips event emitter
    // get the current value of this._trips and add the newTrip onto it, creating a new value to emit
    this._trips.next(this._trips.getValue().concat(newTrip));
    // this._trips Trip array is now emitted out to all subscribers (the all-trips.page) to update the page automatically
    // SEND THE UPDATED TRIP ARRAY TO THE BACKEND FOR SERVER STORAGE!!
  }
}
