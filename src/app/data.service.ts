import { Injectable } from "@angular/core";
import { Trip } from "../app/models/trip.model";
import { Receipt } from "./models/reciept.model";
import { UserService } from "./user.service";
import { BehaviorSubject } from "rxjs";
import { HttpParams, HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { take } from "rxjs/operators";
import { AlertController, LoadingController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  baseUrl: string = "https://fierce-hollows-81099.herokuapp.com/";

  getInitialDataTrips() {
    console.log(this.userService.user.email);
    const params = new HttpParams().set("user", this.userService.user.email); // get the current user
    return this.http.get<any[]>(`${this.baseUrl}trips`, { params });
  }

  getInitialDataReceipts() {
    // Get Receipts
    const params = new HttpParams().set("user", this.userService.user.email); // get the current user
    return this.http.get<any[]>(`${this.baseUrl}receipts`, { params });
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

  // Update the trips array, emitting the new value to all subscribers and send the new trip to the server
  async newTrip(trip: Trip) {
    const loadingSpinner = await this.loadingCtrl.create({
      message: "please wait...",
    });
    loadingSpinner.present();
    return this.http.post<any[]>(`${this.baseUrl}trips`, trip).subscribe(
      (res) => {
        // If successful Create a new Trip object and emit across app so that app reflects database state
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
        loadingSpinner.dismiss();
        this.presentAlertSuccess("New trip created and saved.");
      },
      (error) => {
        loadingSpinner.dismiss();
        this.presentAlert();
      }
    );
    // Navigate back to all trips page
    // this.router.navigate(["/trips/tabs/all-trips"]);
  }

  async editTrip(updatedTrip: any) {
    const loadingSpinner = await this.loadingCtrl.create({
      message: "please wait...",
    });
    loadingSpinner.present();
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
    return this.http
      .put<any[]>(`${this.baseUrl}trips`, params, { observe: "response" })
      .subscribe(
        (res) => {
          // If we get a response, trip has saved so we want to ammend these details in the application to refelct database state
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
          loadingSpinner.dismiss();
          this.presentAlertSuccess("Data has been saved.");
        },
        (err) => {
          // If error, then data has not been updated in database or app
          loadingSpinner.dismiss();
          this.presentAlert();
        }
      );
  }

  async deleteTrip(tripId: string) {
    const loadingSpinner = await this.loadingCtrl.create({
      message: "please wait...",
    });
    loadingSpinner.present();
    // Delete the trip and associated receipts from the database
    const params = new HttpParams().set("tripId", tripId); // pass the current tripId as a parameter
    return this.http
      .delete<any>(`${this.baseUrl}trips`, { params })
      .subscribe(
        (res) => {
          loadingSpinner.dismiss();
          this.presentAlertSuccess("Trip has been deleted.");
          // Delete the Trip from the local app to reflect database changes
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
        },
        (error) => {
          loadingSpinner.dismiss();
          this.presentAlert();
        }
      );
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

  async newReceipt(receipt: Receipt) {
    const loadingSpinner = await this.loadingCtrl.create({
      message: "please wait...",
    });
    loadingSpinner.present();
    // Create a new Trip object
    let newReceipt = new Receipt(
      receipt.user,
      receipt.tripId,
      receipt.image,
      receipt.price,
      receipt.timestamp
    );
    // add new receipt into database
    this.http.post<any[]>(`${this.baseUrl}receipts`, newReceipt).subscribe(
      (res) => {
        // emit new receipt onto receipt array
        this._reciepts.next(this._reciepts.getValue().concat(newReceipt));
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
          loadingSpinner.dismiss();
          // pass the editted trip details into the editTrip method so that it is editted in the database and emitted across the application
          this.editTrip(currentTrip);
        });
      },
      (error) => {
        loadingSpinner.dismiss();
        this.presentAlert();
      }
    );
  }

  async editReceipt(updatedReceipt: any) {
    const loadingSpinner = await this.loadingCtrl.create({
      message: "please wait...",
    });
    loadingSpinner.present();
    let putData = {
      user: updatedReceipt.tripId,
      tripId: updatedReceipt.location,
      image: updatedReceipt.description,
      price: updatedReceipt.price,
      timestamp: updatedReceipt.timestamp,
    };
    let params = new HttpParams({ fromObject: putData });
    this.http.put<any[]>(`${this.baseUrl}receipts`, params).subscribe((res) => {
      const newReceiptsArray: Receipt[] = [];
      const currentReceipts = this._reciepts.getValue();
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
      this.trips.pipe(take(1)).subscribe(
        (trips) => {
          trips.forEach((trip) => {
            if (trip.tripId === updatedReceipt.tripId) {
              currentTrip = trip;
            }
          });
          currentTrip.price = newTotal; // set the trips price to equal to calculated total
          currentTrip.dateFromAsDate = new Date(currentTrip.dateFrom);
          currentTrip.dateToAsDate = new Date(currentTrip.dateTo);
          loadingSpinner.dismiss();
          // pass the editted trip details into the editTrip method so that it is editted in the database and emitted across the application
          this.editTrip(currentTrip);
        },
        (error) => {
          loadingSpinner.dismiss();
          this.presentAlert();
        }
      );

      // Deal with the Trip. Price needs updated, emitted across the app, and sent to the database
      // Get the current total of all receipts with matching tripId's to the currently editted trip
    });
  }

  async deleteReceipt(receiptToDelete: any) {
    const loadingSpinner = await this.loadingCtrl.create({
      message: "please wait...",
    });
    loadingSpinner.present();
    let putData = {
      user: receiptToDelete.tripId,
      tripId: receiptToDelete.location,
      image: receiptToDelete.description,
      price: receiptToDelete.price,
      timestamp: receiptToDelete.timestamp,
    };
    let params = new HttpParams({ fromObject: putData });
    this.http
      .delete<any>(`${this.baseUrl}receipts`, { params })
      .subscribe(
        (res) => {
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
          // Update the Trip's total to remove the deleted receipts amount and emit across app
          let newTotal = 0;
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
            loadingSpinner.dismiss();
            // pass the editted trip details into the editTrip method so that it is editted in the database and emitted across the application
            this.editTrip(currentTrip);
          });
        },
        (error) => {
          loadingSpinner.dismiss();
          this.presentAlert();
        }
      );
  }

  clearTripsOnLogout() {
    this._trips.next(null);
  }

  // alert controller used when we fail to reach the database preventing data from being saved
  async presentAlert() {
    let alert = await this.alertCtrl.create({
      header: "Error",
      message:
        "Data was not saved, please ensure you have internet connectivity and restart the app.",
      buttons: [
        {
          text: "OK",
          handler: () => {
            this.router.navigate(["/trips/tabs/all-trips"]);
          },
        },
      ],
    });
    alert.present();
  }

  // alert controller used when we fail to reach the database preventing data from being saved
  async presentAlertSuccess(message: string) {
    console.log("success hit");
    let alert = await this.alertCtrl.create({
      header: "Success",
      message: `${message}`,
      buttons: [
        {
          text: "OK",
          handler: () => {
            this.router.navigate(["/trips/tabs/all-trips"]);
          },
        },
      ],
    });
    alert.present();
  }
}
