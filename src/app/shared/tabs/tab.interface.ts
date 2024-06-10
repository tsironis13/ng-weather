import { ComponentRef, TemplateRef, ViewRef } from "@angular/core";
import { TabComponent } from "./tab/tab.component";

export type TabCloseCallback = {
  params: Record<string, unknown>;
  func: (params: Record<string, unknown>) => void;
};

export type Tab = {
  tabId: string;
  title: string;
  template: TemplateRef<Record<string, unknown>>;
  viewRef: ViewRef;
  content: ComponentRef<TabComponent>;
  closeCallback: TabCloseCallback;
};
