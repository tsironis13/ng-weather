import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewRef,
  inject,
  input,
  model,
  signal,
} from "@angular/core";
import { Tab } from "../tab.interface";
import { BehaviorSubject, Subject } from "rxjs";

@Component({
  selector: "app-tab",
  templateUrl: "./tab.component.html",
  styleUrls: ["./tab.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  @Input() active = false;
  @Input() template;
  @Input() dataContext;
}
