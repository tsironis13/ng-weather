import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ConditionsAndZip } from "app/conditions-and-zip.type";
import { WeatherService } from "app/weather.service";
import { DecimalPipe } from "@angular/common";

@Component({
    selector: "app-weather-conditions",
    templateUrl: "./weather-conditions.component.html",
    styleUrls: ["./weather-conditions.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterLink, DecimalPipe],
})
export class WeatherConditionsComponent {
  protected weatherConditions = input<ConditionsAndZip>();

  private router = inject(Router);
  protected weatherService = inject(WeatherService);

  showForecast(zipcode: string) {
    this.router.navigate(["/forecast", zipcode]);
  }
}
