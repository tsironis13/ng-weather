import { ComponentRef, TemplateRef, ViewRef } from "@angular/core";
import { TabComponent } from "./tab/tab.component";

export type TabCloseCallback = {
  params: Record<string, any>;
  func: (params: Record<string, any>) => void;
};

export type Tab = {
  tabId: string;
  title: string;
  template: TemplateRef<any>;
  viewRef: ViewRef;
  content: ComponentRef<TabComponent>;
  closeCallback: TabCloseCallback;
};
