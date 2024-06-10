import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  inject,
} from "@angular/core";
import { TabComponent } from "../tab/tab.component";
import { Tab, TabCloseCallback } from "../tab.interface";

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
  protected tabs: Tab[] = [];
  private index = 0;

  private changeDetectorRef = inject(ChangeDetectorRef);

  @ViewChild(TabTemplateDirective, { read: ViewContainerRef, static: true })
  private tabTemplateContainerRef: ViewContainerRef;

  openTab<T extends Record<string, unknown>>(
    title: string,
    template: TemplateRef<T>,
    closeCallback: TabCloseCallback,
    data?: T
  ) {
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
      closeCallback,
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

    if (tabToClose.closeCallback) {
      tabToClose.closeCallback.func(tabToClose.closeCallback.params);
    }

    this.removeTab(tabToClose, tabIndexToClose);
  }

  private selectTab(tabId: string) {
    this.tabs.map((t) => (t.content.instance.active = false));

    const tab = this.tabs.find((t) => t.tabId === tabId);

    tab.content.instance.active = true;

    this.tabTemplateContainerRef.detach();
    this.tabTemplateContainerRef.insert(tab.viewRef);
  }

  /**
   * This method is reponsible for removing an either active or inactive tab
   * and resetting the correct active tab.
   * In case the tab to remove is the first one, change detection is triggered manually
   * to set the correct active class to the related tab
   *
   * @param tab
   * @param tabIndex
   * @returns
   */
  private removeTab(tab: Tab, tabIndex: number) {
    if (!tab.content.instance.active) {
      this.tabs.splice(tabIndex, 1);

      return;
    }

    tab.content.instance.active = false;

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
