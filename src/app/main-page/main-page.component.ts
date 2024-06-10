import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  ViewChild,
  computed,
  inject,
} from "@angular/core";
import { Location, LocationsStore } from "app/location.service";
import { TabsContainerComponent } from "app/shared/tabs/tabs-container/tabs-container.component";
import { WeatherService } from "app/weather.service";
import { mergeMap, take, tap, toArray } from "rxjs/operators";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { from } from "rxjs";
import { TabCloseCallback } from "app/shared/tabs/tab.interface";
import { WeatherConditions } from "app/weather-conditions/weather-conditions.type";
import { ConditionsAndZip } from "app/conditions-and-zip.type";

@Directive({
  selector: "[dynamicTab]",
})
export class DynamicTabTemplateDirective {
  constructor(public templateRef: TemplateRef<Record<string, unknown>>) {}
}

@Directive({
  selector: "[weatherCondition]",
})
export class WeatherConditionTabTemplateDirective {
  constructor(public templateRef: TemplateRef<Record<string, unknown>>) {}
}

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent {
  @ViewChild(WeatherConditionTabTemplateDirective, {
    read: TemplateRef,
    static: true,
  })
  private weatherConditionTabTemplate: TemplateRef<Record<string, unknown>>;
  @ViewChild(DynamicTabTemplateDirective, { read: TemplateRef, static: true })
  private dynamicTabTemplateRef: TemplateRef<Record<string, unknown>>;
  @ViewChild(TabsContainerComponent)
  private tabsContainerComponent: TabsContainerComponent;

  private weatherService = inject(WeatherService);
  private locationsStore = inject(LocationsStore);

  /**
   * Lazy computed signal responsive for opening all initial weather conditions tabs.
   */
  private currentConditionsComputed = computed(() =>
    this.openCurrentWeatherConditionsTabs(
      this.weatherService.getCurrentConditions()()
    )
  );
  /**
   * Lazy computed signal called only when new location is added
   * and is responsible for calling the respecttive method to save the last location weather conditions.
   */
  private lastAddedLocation = computed(() => {
    this.addCurrentWeatherConditionsByLocation(
      this.locationsStore.getLastAddedLocation()
    );
  });
  /**
   * Lazy computed signal responsible for opening each newly added location weather conditions tab.
   */
  private lastAddedWeatherConditions = computed(() => {
    this.openCurrentWeatherConditionsTabs([
      this.weatherService.getLastAddedWeatherConditions(),
    ]);
  });

  constructor() {
    this.weatherService.clearCurrentCoditions();

    this.addCurrentWeatherConditions();
  }

  //just for demonstration that any kind of data and UI can be added as a tab
  addDynamicTab() {
    this.openTab("test dynamic tab", this.dynamicTabTemplateRef, null);
  }

  /**
   * Add location by zipCode.
   * When location is added call computed signal 'lastAddedLocation'
   * which is responsible to save the respective location weather conditions.
   *
   * @param zipCode
   */
  addLocation(zipCode: string) {
    this.locationsStore
      .addLocation(zipCode)
      .pipe(
        take(1),
        tap(() => this.lastAddedLocation())
      )
      .subscribe();
  }

  private addCurrentWeatherConditionsByLocation(location: Location) {
    this.weatherService
      .addCurrentCondition(location.zip)
      .pipe(
        take(1),
        tap(() => this.lastAddedWeatherConditions())
      )
      .subscribe();
  }

  /**
   * Load all current weather conditions for each saved location initially.
   * When all current conditions are added, the 'currentConditionsComputed' computed signal is triggered.
   * This computed signal is lazy and will be called only once when the target component is initialized and
   * all weather conditions have been added.
   */
  private addCurrentWeatherConditions() {
    toObservable(this.locationsStore.entities)
      .pipe(
        take(1),
        takeUntilDestroyed(),
        mergeMap((locs) =>
          from(locs).pipe(
            mergeMap((loc) => this.weatherService.addCurrentCondition(loc.zip))
          )
        ),
        toArray(),
        tap(() => this.currentConditionsComputed())
      )
      .subscribe();
  }

  private openCurrentWeatherConditionsTabs(
    conditionsAndZip: ConditionsAndZip[]
  ) {
    conditionsAndZip.map((cz) => {
      const title = `${cz.data.name} (${cz.zip})`;
      this.openTab<WeatherConditions>(
        title,
        this.weatherConditionTabTemplate,
        this.getRemoveLocationCallback(cz.zip),
        {
          data: cz.data,
          zip: cz.zip,
        }
      );
    });
  }

  private openTab<T>(
    title: string,
    template: TemplateRef<Record<string, unknown>>,
    closeCallback: TabCloseCallback,
    content?: { data: T; zip: string | number }
  ) {
    this.tabsContainerComponent.openTab(
      title,
      template,
      closeCallback ?? null,
      content
        ? {
            data: content.data,
            zip: content.zip,
          }
        : null
    );
  }

  private getRemoveLocationCallback(zipCode: string | number) {
    return {
      params: { zipCode },
      func: this.removeLocationCallback,
    };
  }

  /**
   * Remove location tab callback.
   * This callback is called when a weather conditions tab is removed
   * and handles the removal of respective location and their associated weather conditions
   */
  private removeLocationCallback = (params: { zipCode: string | number }) => {
    this.locationsStore
      .removeLocation(params.zipCode)
      .pipe(
        take(1),
        tap(() => this.weatherService.removeCurrentConditions(params.zipCode))
      )
      .subscribe();
  };
}
