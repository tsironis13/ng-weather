import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
} from "@angular/core";

@Component({
  selector: "app-tab",
  templateUrl: "./tab.component.html",
  styleUrls: ["./tab.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  @Input() active = false;
  @Input() template: TemplateRef<any>;
  @Input() dataContext: any;
}
