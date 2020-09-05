import { Injectable, OnInit } from "@angular/core";
import { Trip } from "../app/models/trip.model";
import { Receipt } from "./models/reciept.model";
import { UserService } from "./user.service";
import { BehaviorSubject } from "rxjs";
import { HttpParams, HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(private userService: UserService, private http: HttpClient) {
    // On service creation, send http requests to get initial Trips and Recipts

    // Get trips
    let params = new HttpParams().set("user", this.userService.user.email); // get the current user
    this.http
      .get<any[]>(`http://localhost:3000/trips`, { params })
      .subscribe((returnedTrips) => {
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
        this.getInitialTrips(usersTripArray);
      });

    // Get Recipts
    this.http
      .get<any[]>(`http://localhost:3000/receipts`, { params })
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
        this.getInitialReciepts(usersRecieptArray);
      });
  }

  private _trips = new BehaviorSubject<Trip[]>([]);
  // array of all trips for that user via a http request to the REST api (node.js server).
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
  newTrip(
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

  // will hold an array of all the fetched reciepts for a user from database
  private _reciepts = new BehaviorSubject<Receipt[]>([]);
  // array of all receipts for that user via a http request to the REST api (node.js server).
  // BehaviourSubject ensures that any page which subscribes to this observable gets the current value until another value is emitted.

  get reciepts() {
    return this._reciepts.asObservable();
    // reciepts can now be subscribed to from other components. This works well as any subscription will be emitted with the most
    // upto date value, which it can then be stored directly in the component which needs it. We never need to access the current
    // Reciepts array directly, as this value may not be updated like an observable will
  }

  // trips fetched from the server are sent here to be emitted to _trips so that the data is updated across the application
  getInitialReciepts(initialReciepts: Receipt[]) {
    this._reciepts.next(initialReciepts);
  }
}
