import { Injectable } from "@angular/core";
import { Trip } from "../app/models/trip.model";
import { Receipt } from "../app/models/recipt.model";
import { UserService } from "./user.service";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(private userService: UserService) {}

  private _trips = new BehaviorSubject<Trip[]>([]);
  // array of all trips for that user. Initial value is gained from all-trips.page.ts onLoad
  // via a http request to the REST api (node.js server).
  // BehaviourSubject ensures that any page which subscribes to this observable gets the current value until another value is emitted.

  get trips() {
    return this._trips.asObservable();
    // trips can now be subscribed to from other components. This works well as any subscription will be emitted with the most
    // upto date value, which it can then be stored directly in the component which needs it. We never need to access the current
    // Trips array directly, as this value may not be updated like an observable will
  }

  // trips fetched from the server are sent here to be emitted to _trips so that the data is updated across the application
  getInitialTrips(initialTrips: Trip[]) {
    this._trips.next(initialTrips);
  }

  // Update the trips array, emitting the new value to all subscribers.
  // SEND NEW TRIP TO THE SERVER!!!
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
    // get the current value of this._trips and add the newTrip onto it, creating a new value to emit
    this._trips.next(this._trips.getValue().concat(newTrip));
    // this._trips Trip array is now emitted out to all subscribers to update the page automatically
    // SEND THE UPDATED TRIP ARRAY TO THE BACKEND FOR SERVER STORAGE!!
  }

  // will hold an array of all the fetches reciepts for a user from database
  private _recipts: Receipt[];

  getRecipts() {
    return this._recipts;
  }
}
