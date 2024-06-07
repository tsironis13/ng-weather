import { Component, inject, input, output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { ConditionsAndZip } from "app/conditions-and-zip.type";
import { TabsService } from "app/tabs.service";
import { WeatherService } from "app/weather.service";

@Component({
  selector: "app-weather-conditions",
  templateUrl: "./weather-conditions.component.html",
  styleUrls: ["./weather-conditions.component.css"],
})
export class WeatherConditionsComponent {
  weatherConditions = input<ConditionsAndZip>();
  removeLocation = output<string | number>();

  private router = inject(Router);
  private tabsService = inject(TabsService);
  protected weatherService = inject(WeatherService);

  constructor() {
    this.tabsService.tabRemovedObs
      .pipe(takeUntilDestroyed())
      .subscribe((x: ConditionsAndZip) => this.removeLocation.emit(x.zip));
  }

  showForecast(zipcode: string) {
    this.router.navigate(["/forecast", zipcode]);
  }
}
