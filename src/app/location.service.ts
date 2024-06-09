import { inject } from "@angular/core";
import { patchState, signalStore, withHooks, withMethods } from "@ngrx/signals";
import {
  addEntity,
  removeEntity,
  setEntities,
  withEntities,
} from "@ngrx/signals/entities";
import { of } from "rxjs";
import { HttpCacheService } from "./http-cache.service";

export const LOCATIONS: string = "locations";

export type Location = {
  zip: number | string;
};

export const LocationsStore = signalStore(
  { providedIn: "root" },
  withEntities<Location>(),
  withMethods((store, httpCache = inject(HttpCacheService)) => ({
    loadAllLocations() {
      let locString = httpCache.getStorageItemByKey(LOCATIONS);
      if (locString) {
        const locations = locString.data as Location[];
        patchState(store, setEntities(locations, { idKey: "zip" }));
      }
    },
    addLocation(zip: string | number) {
      const entity = { zip };
      patchState(store, addEntity(entity, { idKey: "zip" }));
      httpCache.saveDataByKey(LOCATIONS, store.entities());

      return of(entity);
    },
    removeLocation(zip: string | number) {
      let locationToRemove = store
        .entities()
        .find((locations) => locations.zip === zip);
      if (locationToRemove) {
        patchState(store, removeEntity(locationToRemove.zip));

        httpCache.saveDataByKey(LOCATIONS, store.entities());
      }

      return of(locationToRemove);
    },
    getLastAddedLocation() {
      return store.entities()[store.entities().length - 1];
    },
  })),
  withHooks({
    onInit(store) {
      store.loadAllLocations();
    },
  })
);
