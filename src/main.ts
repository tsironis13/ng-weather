import {
  enableProdMode,
  InjectionToken,
  provideExperimentalZonelessChangeDetection,
} from "@angular/core";

import { environment } from "./environments/environment";
import { AppComponent } from "./app/app.component";
import { provideServiceWorker } from "@angular/service-worker";
import { APP_ROUTES } from "./app/app.routing";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import {
  withInterceptorsFromDi,
  provideHttpClient,
} from "@angular/common/http";
import { bootstrapApplication } from "@angular/platform-browser";

export const CACHE_VALID_DURATION_TOKEN = new InjectionToken<number>(
  "CACHE_VALID_DURATION"
);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideServiceWorker('"/ngsw-worker.js"', {
      enabled: environment.production,
    }),
    {
      provide: CACHE_VALID_DURATION_TOKEN,
      useValue: 7200000,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
});
