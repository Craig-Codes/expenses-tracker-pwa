import { Component, Output, EventEmitter, Input } from "@angular/core";
import { Plugins, CameraSource, CameraResultType } from "@capacitor/core";

@Component({
  selector: "app-image-picker",
  templateUrl: "../image-picker/image-picker.component.html",
  styleUrls: ["../image-picker/image-picker.component.scss"],
})
export class ImagePickerComponent {
  @Output() imagePick = new EventEmitter<string>(); // custom event is emitted in parent component, with parameter passed as the emit value
  @Input() showPreview = false; // value is taken from the parent component. In this case, the form.value.image from the recipt-new.page.ts
  selectedImage: string;

  constructor() {}

  onPickImage() {
    Plugins.Camera.getPhoto({
      quality: 10, // quality doesn't need to be really high, as long as receipts are legible. Smaller iamges will save room in the database
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    })
      .then((image) => {
        this.selectedImage = image.dataUrl; // image base64 string which can be used as an image src
        this.imagePick.emit(image.dataUrl); // this event is emitted, triggering the event on the receipt new page
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
