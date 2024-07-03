import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnChanges,
  SimpleChanges,
  input,
  model,
  output,
} from "@angular/core";

@Component({
    selector: "app-tab-header",
    templateUrl: "./tab-header.component.html",
    styleUrls: ["./tab-header.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class TabHeaderComponent implements OnChanges {
  active = model<boolean>();
  title = input<string>();
  tabId = input<string>();

  onTabSelected = output<string>();
  onTabClosed = output<string>();

  @HostBinding("class") public hostClass = "";

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.active?.currentValue === true) {
      this.hostClass = "active";
    } else {
      this.hostClass = "";
    }
  }

  selectTab(tabId: string) {
    this.onTabSelected.emit(tabId);
  }

  closeTab(tabId: string) {
    this.onTabClosed.emit(tabId);
  }
}
