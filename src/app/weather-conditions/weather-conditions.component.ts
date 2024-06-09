import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { Router } from "@angular/router";
import { ConditionsAndZip } from "app/conditions-and-zip.type";
import { WeatherService } from "app/weather.service";

@Component({
  selector: "app-weather-conditions",
  templateUrl: "./weather-conditions.component.html",
  styleUrls: ["./weather-conditions.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherConditionsComponent {
  protected weatherConditions = input<ConditionsAndZip>();

  private router = inject(Router);
  protected weatherService = inject(WeatherService);

  showForecast(zipcode: string) {
    this.router.navigate(["/forecast", zipcode]);
  }
}
