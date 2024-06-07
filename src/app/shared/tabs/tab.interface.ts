import { ComponentRef, TemplateRef, ViewRef } from "@angular/core";
import { TabComponent } from "./tab/tab.component";

export type Tab = {
  tabId: string;
  title: string;
  template: TemplateRef<any>;
  viewRef: ViewRef;
  content: ComponentRef<TabComponent>;
};
