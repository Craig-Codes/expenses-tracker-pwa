import { Injectable } from "@angular/core";
import { Trip } from "../app/models/trip.model";
import { Receipt } from "./models/reciept.model";
import { UserService } from "./user.service";
import { BehaviorSubject } from "rxjs";
import { HttpParams, HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { take } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router
  ) {
    // On service creation, send http requests to get initial Trips and Recipts

    // Get trips
    console.log(this.userService.user.email);
    const params = new HttpParams().set("user", this.userService.user.email); // get the current user
    this.http
      .get<any[]>(`${this.baseUrl}trips`, { params })
      .subscribe((returnedTrips) => {
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
        this.getInitialTrips(usersTripArray);
      });

    // Get Receipts
    this.http
      .get<any[]>(`${this.baseUrl}receipts`, { params })
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

  baseUrl: string = "http://localhost:3000/";

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

  // Update the trips array, emitting the new value to all subscribers and send the new trip to the server
  newTrip(trip: Trip) {
    // Create a new Trip object
    let newTrip = new Trip(
      trip.user,
      trip.tripId,
      trip.location,
      trip.description,
      trip.dateFrom,
      trip.dateTo,
      trip.price
    );
    // get the current value of this._trips and add the newTrip onto it, creating a new value to emit
    this._trips.next(this._trips.getValue().concat(newTrip));
    this.http.post<any[]>(`${this.baseUrl}trips`, trip).subscribe();
    // Navigate back to all trips page
    this.router.navigate(["/trips/tabs/all-trips"]);
  }

  editTrip(updatedTrip: any) {
    const newTripsArray: Trip[] = [];
    const currentTrips = this._trips.getValue();
    console.log(updatedTrip);
    // loop through the current trips and add all trips which do not have the editted trip's id into a new array.
    // The updated trip is then also pushed to this new array, which can be emitted to update the value around the app.
    currentTrips.forEach((trip) => {
      if (trip.tripId !== updatedTrip.tripId) {
        newTripsArray.push(trip);
      }
    });
    let edittedTrip = new Trip(
      updatedTrip.user,
      updatedTrip.tripId,
      updatedTrip.location,
      updatedTrip.description,
      updatedTrip.dateFrom,
      updatedTrip.dateTo,
      updatedTrip.price
    );
    newTripsArray.push(edittedTrip);
    this._trips.next(newTripsArray);

    // Update the trip on the database by sending it to the server
    // convert the dates to strings in the correct format, as need to send data as string in http request (converted back to dates for storage by the server):
    let dateToString = updatedTrip.dateFromAsDate.toISOString();
    let dateFromString = updatedTrip.dateToAsDate.toISOString();

    let putData = {
      tripId: updatedTrip.tripId,
      location: updatedTrip.location,
      description: updatedTrip.description,
      dateFrom: dateToString,
      dateTo: dateFromString,
      amount: updatedTrip.price,
    };
    let params = new HttpParams({ fromObject: putData });
    this.http.put<any[]>(`${this.baseUrl}trips`, params).subscribe();
    this.router.navigate(["/trips/tabs/all-trips"]);
  }

  deleteTrip(tripId: string) {
    console.log("trip deleted");
    // Delete the Trip from the local app
    const newTripsArray: Trip[] = [];
    const currentTrips = this._trips.getValue();
    currentTrips.forEach((trip) => {
      // Create a new array, only pushing in objects whose Id's do not match the passed in tripId parameter
      if (trip.tripId !== tripId) {
        newTripsArray.push(trip);
      }
    });
    this._trips.next(newTripsArray); // emit the newTripsArray, passing the application an array without the item to be deleted
    // Create a new array, only pushing the receipts whose id's do not match the passed tripId parameter
    const newReceiptsArray: Receipt[] = [];
    const currentReceipts = this._reciepts.getValue();
    currentReceipts.forEach((receipt) => {
      // Create a new array, only pushing in objects whose Id's do not match the passed in tripId parameter
      if (receipt.tripId !== tripId) {
        newReceiptsArray.push(receipt);
      }
    });
    this._reciepts.next(newReceiptsArray); // emit the newTripsArray, passing the application an array without the item to be deleted
    // Delete the trip and associated receipts from the database
    const params = new HttpParams().set("tripId", tripId); // pass the current tripId as a parameter
    this.http
      .delete<any>(`${this.baseUrl}trips`, { params })
      .subscribe();
    // navigate back to all trips page
    this.router.navigate(["/trips/tabs/all-trips"]);

    // DELETE ALL ASSOCIATED RECEIPTS - BOTH IN APP AND DATABASE!!!
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

  newReceipt(receipt: Receipt) {
    // Create a new Trip object
    let newReceipt = new Receipt(
      receipt.user,
      receipt.tripId,
      receipt.image,
      receipt.price,
      receipt.timestamp
    );
    console.log(newReceipt);
    // emit new receipt onto receipt array
    this._reciepts.next(this._reciepts.getValue().concat(newReceipt));
    // add new receipt into database
    this.http.post<any[]>(`${this.baseUrl}receipts`, newReceipt).subscribe();
    // get all receipts which belong to the trip, loop through them to get total price
    const currentReceipts = this._reciepts.getValue();
    let newTotal = 0;
    console.log(currentReceipts);
    currentReceipts.forEach((receipt) => {
      if (receipt.tripId === newReceipt.tripId) {
        newTotal += receipt.price;
      }
    });
    console.log("newTotal ======= ", newTotal);
    // fetch current trip, make its price equal total price
    let currentTrip: any = {};
    // subscribing to a behaviour subject gives the current value
    this.trips.pipe(take(1)).subscribe((trips) => {
      trips.forEach((trip) => {
        if (trip.tripId === newReceipt.tripId) {
          currentTrip = trip;
        }
      });
      currentTrip.price = newTotal;
      currentTrip.dateFromAsDate = new Date(currentTrip.dateFrom);
      currentTrip.dateToAsDate = new Date(currentTrip.dateTo);
      console.log(currentTrip);
      // pass the editted trip details into the editTrip method so that it is editted in the database and emitted across the application
      this.editTrip(currentTrip);
    });
  }

  editReceipt(updatedReceipt: any) {
    const newReceiptsArray: Receipt[] = [];
    const currentReceipts = this._reciepts.getValue();
    console.log(updatedReceipt);
    // loop through the current receipts and add all receipts which do not have the editted receipts timestamp into a new array.
    // The updated receipt is then also pushed to this new array, which can be emitted to update the value around the app.
    currentReceipts.forEach((receipt) => {
      if (receipt.timestamp !== updatedReceipt.timestamp) {
        newReceiptsArray.push(receipt);
      }
    });
    let edittedReceipt = new Receipt(
      updatedReceipt.user,
      updatedReceipt.tripId,
      updatedReceipt.image,
      updatedReceipt.price,
      updatedReceipt.timestamp
    );
    newReceiptsArray.push(edittedReceipt);
    this._reciepts.next(newReceiptsArray);
    // Update the Receipt on the database by sending it to the server
    // convert the dates to strings in the correct format, as need to send data as string in http request (converted back to dates for storage by the server):
    console.log(typeof edittedReceipt.timestamp);

    let putData = {
      user: updatedReceipt.tripId,
      tripId: updatedReceipt.location,
      image: updatedReceipt.description,
      price: updatedReceipt.price,
      timestamp: updatedReceipt.timestamp,
    };
    let params = new HttpParams({ fromObject: putData });
    this.http.put<any[]>(`${this.baseUrl}receipts`, params).subscribe();

    // Deal with the Trip. Price needs updated, emitted across the app, and sent to the database
    // Get the current total of all receipts with matching tripId's to the currently editted trip
    let newTotal = 0;
    console.log(currentReceipts);
    currentReceipts.forEach((receipt) => {
      if (receipt.tripId === updatedReceipt.tripId) {
        newTotal += receipt.price;
      }
    });
    console.log("newTotal ======= ", newTotal);
    // Get the trip by the updatedReceipts tripId
    let currentTrip: any = {};
    this.trips.pipe(take(1)).subscribe((trips) => {
      trips.forEach((trip) => {
        if (trip.tripId === updatedReceipt.tripId) {
          currentTrip = trip;
        }
      });
      currentTrip.price = newTotal; // set the trips price to equal to calculated total
      currentTrip.dateFromAsDate = new Date(currentTrip.dateFrom);
      currentTrip.dateToAsDate = new Date(currentTrip.dateTo);
      console.log(currentTrip);
      // pass the editted trip details into the editTrip method so that it is editted in the database and emitted across the application
      this.editTrip(currentTrip);
    });
  }

  deleteReceipt(receiptToDelete: any) {
    console.log("receiptToDelete ====== ", receiptToDelete);
    console.log(
      "receiptToDelete typeof timestamp ====== ",
      typeof receiptToDelete.timestamp
    );
    // Delete the Trip from the local app
    const newReceiptsArray: Receipt[] = [];
    const currentReceipts = this._reciepts.getValue();
    currentReceipts.forEach((receipt) => {
      // Create a new array, only pushing in objects whose Id's do not match the passed in tripId parameter
      if (receipt.timestamp !== receiptToDelete.timestamp) {
        newReceiptsArray.push(receipt);
      }
    });
    this._reciepts.next(newReceiptsArray); // emit the newReceiptsArray, passing the application an array without the item to be deleted
    // Delete the receipt from the database via API
    const params = new HttpParams().set("timestamp", receiptToDelete.timestamp); // pass the receipt timestamp as a parameter
    this.http
      .delete<any>(`${this.baseUrl}receipts`, { params })
      .subscribe();
    // Update the Trip's total to remove the deleted receipts amount and emit across app
    let newTotal = 0;
    // currentReceipts.forEach((receipt) => {
    //   if (receipt.tripId === receiptToDelete.tripId) {
    //     newTotal += receipt.price;
    //   }
    // });
    this.reciepts.pipe(take(1)).subscribe((receipts) => {
      receipts.forEach((receipt) => {
        if (receipt.tripId === receiptToDelete.tripId) {
          newTotal += receipt.price;
        }
      });
    });
    console.log("newTotal ======= ", newTotal);
    // Get the trip by the updatedReceipts tripId
    let currentTrip: any = {};
    this.trips.pipe(take(1)).subscribe((trips) => {
      trips.forEach((trip) => {
        if (trip.tripId === receiptToDelete.tripId) {
          currentTrip = trip;
        }
      });
      currentTrip.price = newTotal; // set the trips price to equal to calculated total
      currentTrip.dateFromAsDate = new Date(currentTrip.dateFrom);
      currentTrip.dateToAsDate = new Date(currentTrip.dateTo);
      console.log(currentTrip);
      // pass the editted trip details into the editTrip method so that it is editted in the database and emitted across the application
      this.editTrip(currentTrip);
    });
  }

  clearTripsOnLogout() {
    this._trips.next(null);
  }
}
