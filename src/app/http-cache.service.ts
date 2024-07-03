import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { CACHE_VALID_DURATION_TOKEN } from "main";
import { of } from "rxjs";
import { tap } from "rxjs/operators";

type StorageItem<T> = {
  validUntil: number;
  data: T;
};

/**
 * This service is in charge of caching the http requests for the duration
 * of the provided 'CACHE_VALID_DURATN_TOKEN'. If entry key requested exists
 * in local browser storage and it is still valid, data are retrieved locally
 * otherwise a new http request is fired.
 */
@Injectable({ providedIn: "root" })
export class HttpCacheService<T> {
  http = inject(HttpClient);
  cacheDurationToken = inject(CACHE_VALID_DURATION_TOKEN);

  saveDataByKey(key: string, data: T) {
    const validUntil = Date.now() + this.cacheDurationToken;

    localStorage.setItem(key, JSON.stringify({ validUntil, data }));
  }

  getHttpCachedDataByKey(key: string, url: string) {
    const parsedItem = this.getStorageItemByKey(key);

    if (Date.now() < parsedItem?.validUntil) {
      return of(parsedItem.data);
    }

    return this.getHttpData<T>(url).pipe(
      tap((data) => this.saveDataByKey(key, data))
    );
  }

  getStorageItemByKey(key: string) {
    let storageItem = localStorage.getItem(key);

    const parsedItem: StorageItem<T> = JSON.parse(storageItem);

    return parsedItem;
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  private getHttpData<T>(url: string) {
    return this.http.get<T>(url);
  }
}
