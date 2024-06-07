import { Injectable, Signal, inject, signal } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { WeatherConditions } from "./weather-conditions/weather-conditions.type";
import { ConditionsAndZip } from "./conditions-and-zip.type";
import { Forecast } from "./forecasts-list/forecast.type";
import { HttpCacheService } from "./http-cache.service";

export const WEATHER_CONDITIONS = "weatherConditions";
export const FORECAST = "forecast";

@Injectable({
  providedIn: "root",
})
export class WeatherService {
  static URL = "http://api.openweathermap.org/data/2.5";
  static APPID = "5a4b2d457ecbef9eb2a71e480b947604";
  static ICON_URL =
    "https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/";
  private currentConditions = signal<ConditionsAndZip[]>([]);

  httpCacheService = inject(HttpCacheService);

  addCurrentCondition(zipcode: string | number) {
    const url = `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`;

    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.httpCacheService
      .getHttpCachedDataByKey<WeatherConditions>(
        `${WEATHER_CONDITIONS}-${zipcode}`,
        url
      )
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

  getForecast(zipcode: string): Observable<Forecast> {
    const url = `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`;
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.httpCacheService.getHttpCachedDataByKey<Forecast>(
      `${FORECAST}-${zipcode}`,
      url
    );
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

// function getReq(http: HttpClient, locations) {
//   let reqs = [];
//   for (let i = 0; i < locations.length; i++) {
//     reqs.push(
//       http
//         .get<WeatherConditions>(
//           `${URL}/weather?zip=${locations[i].zip},us&units=imperial&APPID=${APPID}`
//         )
//         .pipe(
//           map((z) => {
//             return { data: z, zip: locations[i].zip };
//           })
//         )
//     );
//   }

//   return reqs;
// }

// export const WeatherStore = signalStore(
//   { providedIn: "root" },
//   withEntities<ConditionsAndZip>(),
//   withMethods((store, http = inject(HttpClient)) => ({
//     loadWeatherConditionsByLocations(locs: Location[]) {
//       const weatherConditions = [];

//       locs.forEach((wc) => {
//         const wCondition = store.entities().find((e) => e.zip === wc.zip);

//         if (wCondition) {
//           weatherConditions.push(wCondition);
//         }
//       });
//       return weatherConditions;
//     },
//     // getWeatherConditionsByLocations: rxMethod<Location[]>(
//     //   pipe(
//     //     concatMap((locs) => forkJoin(getReq(http, locs))),
//     //     tapResponse({
//     //       next: (weatherCondition: ConditionsAndZip[]) => {
//     //         return patchState(
//     //           store,
//     //           addEntities(weatherCondition, {
//     //             idKey: "zip",
//     //           })
//     //         );
//     //       },
//     //       error: console.error,
//     //     })
//     //   )
//     // ),
//     getWeatherConditionsByLocation: rxMethod<Location>(
//       pipe(
//         concatMap((locs) =>
//           http
//             .get<WeatherConditions>(
//               `${URL}/weather?zip=${locs.zip},us&units=imperial&APPID=${APPID}`
//             )
//             .pipe(
//               map((z) => {
//                 return { data: z, zip: locs.zip };
//               })
//             )
//         ),
//         tapResponse({
//           next: (conditionsAndZip: ConditionsAndZip) => {
//             return patchState(
//               store,
//               addEntity(conditionsAndZip, { idKey: "zip" })
//             );
//           },
//           error: console.error,
//         })
//       )
//     ),
//     removeWeatherConditionsByLocation(loc: Location) {
//       let conditionToRemove = store
//         .entities()
//         .find((cond) => cond.zip === loc.zip);

//       if (conditionToRemove) {
//         patchState(store, removeEntity(conditionToRemove.zip));
//       }
//     },
//     getWeatherIcon(id: number) {
//       if (id >= 200 && id <= 232) return ICON_URL + "art_storm.png";
//       else if (id >= 501 && id <= 511) return ICON_URL + "art_rain.png";
//       else if (id === 500 || (id >= 520 && id <= 531))
//         return ICON_URL + "art_light_rain.png";
//       else if (id >= 600 && id <= 622) return ICON_URL + "art_snow.png";
//       else if (id >= 801 && id <= 804) return ICON_URL + "art_clouds.png";
//       else if (id === 741 || id === 761) return ICON_URL + "art_fog.png";
//       else return ICON_URL + "art_clear.png";
//     },
//     getForecast(zip: string) {
//       return http.get<Forecast>(
//         `${URL}/forecast/daily?zip=${zip},us&units=imperial&cnt=5&APPID=${APPID}`
//       );
//     },
//   })),
//   withHooks({
//     onInit(store, locationsStore = inject(LocationsStore)) {
//       locationsStore.entities().forEach((loc) => {
//         store.getWeatherConditionsByLocation(loc);
//       });
//     },
//   })
// );
