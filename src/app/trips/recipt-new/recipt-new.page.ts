import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-recipt-new",
  templateUrl: "./recipt-new.page.html",
  styleUrls: ["./recipt-new.page.scss"],
})
export class ReciptNewPage implements OnInit {
  form: FormGroup;

  constructor() {}

  ngOnInit() {
    // create the reactive form
    this.form = new FormGroup({
      image: new FormControl(null),
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
  }

  onAddReceipt() {}
}
