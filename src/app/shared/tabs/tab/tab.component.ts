import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

@Component({
    selector: "app-tab",
    templateUrl: "./tab.component.html",
    styleUrls: ["./tab.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgTemplateOutlet],
})
export class TabComponent {
  active = false;
  template: TemplateRef<Record<string, unknown>>;
  dataContext: Record<string, unknown>;
}
