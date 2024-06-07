import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  inject,
} from "@angular/core";
import { TabComponent } from "../tab/tab.component";
import { Tab } from "../tab.interface";
import { TabsService } from "app/tabs.service";

@Directive({
  selector: "[tabTemplate]",
})
export class TabTemplateDirective {
  constructor(public viewContainer: ViewContainerRef) {}
}

@Component({
  selector: "app-tabs-container",
  templateUrl: "./tabs-container.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsContainerComponent {
  tabs: Tab[] = [];
  index = 0;

  private changeDetectorRef = inject(ChangeDetectorRef);
  private tabsService = inject(TabsService);

  @ViewChild(TabTemplateDirective, { read: ViewContainerRef, static: true })
  private tabTemplateContainerRef: ViewContainerRef;

  openTab<T>(title: string, template: TemplateRef<any>, data: T) {
    this.tabTemplateContainerRef.detach();
    const componentRef =
      this.tabTemplateContainerRef.createComponent(TabComponent);

    const tabId = `tab-${this.index}`;

    const instance = componentRef.instance;
    instance.template = template;
    instance.dataContext = data;

    this.index++;

    this.tabs.push({
      tabId,
      title,
      template,
      content: componentRef,
      viewRef: this.tabTemplateContainerRef.get(0),
    });

    this.changeDetectorRef.markForCheck();

    this.selectTab(tabId);
  }

  closeTab(tabId: string) {
    const tabIndexToClose = this.tabs.findIndex((t) => t.tabId === tabId);

    if (tabIndexToClose === -1) {
      return;
    }

    const tabToClose = this.tabs[tabIndexToClose];

    this.tabsService.removeTab(tabToClose.content.instance.dataContext);

    this.removeTab(tabToClose, tabIndexToClose);
  }

  private selectTab(tabId: string) {
    this.tabs.map((t) => (t.content.instance.active = false));

    const tab = this.tabs.find((t) => t.tabId === tabId);

    tab.content.instance.active = true;

    this.tabTemplateContainerRef.detach();
    this.tabTemplateContainerRef.insert(tab.viewRef);
  }

  private removeTab(tab: Tab, tabIndex: number) {
    //remove not active tab
    if (!tab.content.instance.active) {
      this.tabs.splice(tabIndex, 1);

      return;
    }

    //deactive current tab
    tab.content.instance.active = false;

    //remove from tabs array and detach container view
    this.tabTemplateContainerRef.detach();

    //activate next tab if tab to close if the first
    if (tabIndex === 0 && this.tabs.length > 1) {
      this.tabTemplateContainerRef.insert(this.tabs[tabIndex + 1].viewRef);
      this.tabs[tabIndex + 1].content.instance.active = true;

      setTimeout(() => {
        this.tabs.splice(tabIndex, 1);
        this.changeDetectorRef.markForCheck();
      });

      return;
    }

    this.tabs.splice(tabIndex, 1);

    if (!this.tabs.length) {
      return;
    }

    this.tabs[tabIndex - 1].content.instance.active = true;
    this.tabTemplateContainerRef.insert(this.tabs[tabIndex - 1].viewRef);
  }
}
