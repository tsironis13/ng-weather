import { Component, inject, output } from "@angular/core";
import { LocationsStore } from "../location.service";

@Component({
  selector: "app-zipcode-entry",
  templateUrl: "./zipcode-entry.component.html",
})
export class ZipcodeEntryComponent {
  onAddLocation = output<string>();

  locationsStore = inject(LocationsStore);

  addLocation(zipCode: string) {
    this.onAddLocation.emit(zipCode);
  }
}
