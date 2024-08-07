import { Routes } from "@angular/router";
import { ForecastsListComponent } from "./forecasts-list/forecasts-list.component";
import { MainPageComponent } from "./main-page/main-page.component";

export const APP_ROUTES: Routes = [
  {
    path: "",
    component: MainPageComponent,
  },
  {
    path: "forecast/:zipcode",
    component: ForecastsListComponent,
  },
];
