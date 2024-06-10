import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Forecast } from "./forecasts-list/forecast.type";
import { HttpCacheService } from "./http-cache.service";
import { environment } from "environments/environment";

export const FORECAST = "forecast";

@Injectable({
  providedIn: "root",
})
export class ForecastService {
  private httpCacheService =
    inject<HttpCacheService<Forecast>>(HttpCacheService);

  getForecast(zipcode: string): Observable<Forecast> {
    const url = `${environment.openweathermapUrl}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${environment.appId}`;
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.httpCacheService.getHttpCachedDataByKey(
      `${FORECAST}-${zipcode}`,
      url
    );
  }
}
