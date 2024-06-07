import { Component, OnInit, inject, input } from "@angular/core";
import { WeatherService } from "../weather.service";
import { Forecast } from "./forecast.type";
import { Observable } from "rxjs";

@Component({
  selector: "app-forecasts-list",
  templateUrl: "./forecasts-list.component.html",
  styleUrls: ["./forecasts-list.component.css"],
})
export class ForecastsListComponent implements OnInit {
  protected forecast$: Observable<Forecast>;
  protected weatherService = inject(WeatherService);

  readonly zipcode = input<string>();

  ngOnInit(): void {
    this.forecast$ = this.weatherService.getForecast(this.zipcode());
  }
}
