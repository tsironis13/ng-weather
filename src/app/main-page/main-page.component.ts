import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
  inject,
} from "@angular/core";
import { LocationsStore } from "app/location.service";
import { TabsContainerComponent } from "app/shared/tabs/tabs-container/tabs-container.component";
import { WeatherService } from "app/weather.service";
import { switchMap, take, tap } from "rxjs/operators";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent {
  @ViewChild("weatherCondition") weatherConditionTabTemplate: TemplateRef<any>;
  @ViewChild(TabsContainerComponent) tabsContainerComponent;

  private weatherService = inject(WeatherService);
  private locationsStore = inject(LocationsStore);

  constructor() {
    this.weatherService.clearCurrentCoditions();

    this.addCurrentWeatherConditions();
  }

  addLocation(zipCode: string) {
    this.locationsStore
      .addLocation(zipCode)
      .pipe(
        take(1),
        switchMap((loc) => this.weatherService.addCurrentCondition(loc.zip))
      )
      .subscribe((weatherConditions) => {
        this.openTab(`${weatherConditions.name} (${zipCode})`, {
          data: weatherConditions,
          zip: zipCode,
        });
      });
  }

  removeLocation(zipCode: string) {
    this.locationsStore
      .removeLocation(zipCode)
      .pipe(
        take(1),
        tap((x) => this.weatherService.removeCurrentConditions(x?.zip))
      )
      .subscribe();
  }

  private addCurrentWeatherConditions() {
    //get all locations and for each one
    //add current weather condition
    toObservable(this.locationsStore.entities)
      .pipe(take(1), takeUntilDestroyed())
      .subscribe((locs) => {
        locs.forEach((loc) => {
          this.weatherService
            .addCurrentCondition(loc.zip)
            .pipe(take(1))
            .subscribe();
        });
      });

    //fetch current conditions for all locations initially
    toObservable(this.weatherService.getCurrentConditions())
      .pipe(take(1), takeUntilDestroyed())
      .subscribe((weatherConditions) => {
        weatherConditions.map((wc) => {
          const title = `${wc.data.name} (${wc.zip})`;
          this.openTab(title, { data: wc.data, zip: wc.zip });
        });
      });
  }

  private openTab(title: string, content: { data: any; zip: string | number }) {
    this.tabsContainerComponent.openTab(
      title,
      this.weatherConditionTabTemplate,
      {
        data: content.data,
        zip: content.zip,
      }
    );
  }
}
