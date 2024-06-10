import { Component, OnInit, inject, input } from "@angular/core";
import { Forecast } from "./forecast.type";
import { Observable } from "rxjs";
import { ForecastService } from "app/forecast.service";
import { WeatherService } from "app/weather.service";

@Component({
  selector: "app-forecasts-list",
  templateUrl: "./forecasts-list.component.html",
  styleUrls: ["./forecasts-list.component.css"],
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
