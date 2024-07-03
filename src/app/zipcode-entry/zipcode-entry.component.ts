import { ChangeDetectionStrategy, Component, output } from "@angular/core";

@Component({
    selector: "app-zipcode-entry",
    templateUrl: "./zipcode-entry.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class ZipcodeEntryComponent {
  onAddLocation = output<string>();

  addLocation(zipCode: string) {
    this.onAddLocation.emit(zipCode);
  }
}
