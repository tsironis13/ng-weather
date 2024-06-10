import { Injectable, Signal, inject, signal } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { WeatherConditions } from "./weather-conditions/weather-conditions.type";
import { ConditionsAndZip } from "./conditions-and-zip.type";
import { Forecast } from "./forecasts-list/forecast.type";
import { HttpCacheService } from "./http-cache.service";
import { environment } from "environments/environment";

export const WEATHER_CONDITIONS = "weatherConditions";

@Injectable({
  providedIn: "root",
})
export class WeatherService {
  static ICON_URL =
    "https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/";
  private currentConditions = signal<ConditionsAndZip[]>([]);

  private httpCacheService =
    inject<HttpCacheService<WeatherConditions>>(HttpCacheService);

  addCurrentCondition(zipcode: string | number) {
    const url = `${environment.openweathermapUrl}/weather?zip=${zipcode},us&units=imperial&APPID=${environment.appId}`;

    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.httpCacheService
      .getHttpCachedDataByKey(`${WEATHER_CONDITIONS}-${zipcode}`, url)
      .pipe(
        tap((data) => {
          this.currentConditions.update((conditions) => [
            ...conditions,
            { zip: zipcode, data },
          ]);
        })
      );
  }

  removeCurrentConditions(zipcode: string | number) {
    if (!zipcode) {
      return;
    }

    this.httpCacheService.removeItem(`${WEATHER_CONDITIONS}-${zipcode}`);
    this.currentConditions.update((conditions) => {
      for (let i in conditions) {
        if (conditions[i].zip == zipcode) conditions.splice(+i, 1);
      }
      return conditions;
    });
  }

  clearCurrentCoditions() {
    this.currentConditions.set([]);
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getLastAddedWeatherConditions() {
    return this.currentConditions()[this.currentConditions().length - 1];
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else return WeatherService.ICON_URL + "art_clear.png";
  }
}
