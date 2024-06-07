import { WeatherConditions } from "./weather-conditions/weather-conditions.type";

export interface ConditionsAndZip {
  zip: string | number;
  data: WeatherConditions;
}
