import { BrowserModule } from "@angular/platform-browser";
import { InjectionToken, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { ZipcodeEntryComponent } from "./zipcode-entry/zipcode-entry.component";
import { ForecastsListComponent } from "./forecasts-list/forecasts-list.component";
import { WeatherConditionsComponent } from "./weather-conditions/weather-conditions.component";
import {
  DynamicTabTemplateDirective,
  MainPageComponent,
  WeatherConditionTabTemplateDirective,
} from "./main-page/main-page.component";
import { RouterModule } from "@angular/router";
import { routing } from "./app.routing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import {
  TabTemplateDirective,
  TabsContainerComponent,
} from "./shared/tabs/tabs-container/tabs-container.component";
import { TabHeaderComponent } from "./shared/tabs/tab-header/tab-header.component";
import { TabComponent } from "./shared/tabs/tab/tab.component";

export const CACHE_VALID_DURATION_TOKEN = new InjectionToken<number>(
  "CACHE_VALID_DURATION"
);

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    WeatherConditionsComponent,
    MainPageComponent,
    TabsContainerComponent,
    TabHeaderComponent,
    TabComponent,
    TabTemplateDirective,
    WeatherConditionTabTemplateDirective,
    DynamicTabTemplateDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register("/ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
  providers: [
    {
      provide: CACHE_VALID_DURATION_TOKEN,
      useValue: 7200000,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
