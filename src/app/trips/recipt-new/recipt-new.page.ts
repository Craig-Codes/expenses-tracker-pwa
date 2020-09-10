import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DataService } from "src/app/data.service";
import { UserService } from "src/app/user.service";

@Component({
  selector: "app-recipt-new",
  templateUrl: "./recipt-new.page.html",
  styleUrls: ["./recipt-new.page.scss"],
})
export class ReciptNewPage implements OnInit {
  form: FormGroup;
  tripId: string;
  newReceipt: any = {};

  constructor(
    private dataService: DataService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.tripId = paramMap.get("tripId"); // get the id from the route params
      console.log(this.tripId);
    });
    // create the reactive form
    this.form = new FormGroup({
      // We use patch Value on this form control once we have an image so that its updated!
      image: new FormControl(null),
      price: new FormControl(null, {
        updateOn: "blur",
        validators: [
          Validators.required,
          Validators.maxLength(7),
          Validators.minLength(1),
        ],
      }),
    });
  }

  // the image-picker.component.ts emits this event as an OUTPUT, so that the recipt.new.page.html fires a custom event
  // the paramenter is the imageData, passed as a generic $event object in the custom event, allowing the parameter to be passed
  // between the two components when ever an image is picked.
  onImagePicked(imageData: string) {
    this.form.patchValue({ image: imageData }); // form data is populated by imageData string from the Camera event
    console.log("form image value ===== ", this.form.value.image);
  }

  onAddReceipt() {
    if (!this.form.valid || !this.form.get("image").value) {
      return;
    }
    console.log(this.form.value.image);
    console.log(this.form.value.price);
    // send new receipt data to the data service to save to database and emit through application
    this.newReceipt.user = this.userService.user.email;
    this.newReceipt.tripId = this.tripId;
    this.newReceipt.image = this.form.value.image;
    this.newReceipt.price = this.form.value.price;
    this.newReceipt.timestamp = new Date();
    this.dataService.newReceipt(this.newReceipt);
  }
}
