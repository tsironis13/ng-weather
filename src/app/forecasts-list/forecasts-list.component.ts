import { Component, OnInit, inject, input } from "@angular/core";
import { Forecast } from "./forecast.type";
import { Observable } from "rxjs";
import { ForecastService } from "app/forecast.service";
import { WeatherService } from "app/weather.service";
import { AsyncPipe, DecimalPipe, DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-forecasts-list",
    templateUrl: "./forecasts-list.component.html",
    styleUrls: ["./forecasts-list.component.css"],
    standalone: true,
    imports: [
        RouterLink,
        AsyncPipe,
        DecimalPipe,
        DatePipe,
    ],
})
export class ForecastsListComponent implements OnInit {
  protected forecast$: Observable<Forecast>;
  protected forecastService = inject(ForecastService);
  protected weatherService = inject(WeatherService);

  readonly zipcode = input<string>();

  ngOnInit(): void {
    this.forecast$ = this.forecastService.getForecast(this.zipcode());
  }
}
