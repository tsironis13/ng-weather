import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { CACHE_VALID_DURATION_TOKEN } from "./app.module";

type StorageItem = {
  validUntil: number;
  data: any;
};

@Injectable({ providedIn: "root" })
export class HttpCacheService {
  http = inject(HttpClient);
  cacheDurationToken = inject(CACHE_VALID_DURATION_TOKEN);

  saveDataByKey(key: string, data: any) {
    const validUntil = Date.now() + this.cacheDurationToken;

    localStorage.setItem(key, JSON.stringify({ validUntil, data }));
  }

  getHttpCachedDataByKey<T>(key: string, url: string): Observable<T> {
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

    const parsedItem: StorageItem = JSON.parse(storageItem);

    return parsedItem;
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  private getHttpData<T>(url: string) {
    return this.http.get<T>(url);
  }
}
