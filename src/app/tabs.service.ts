import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class TabsService {
  private tabRemoved$ = new Subject();

  get tabRemovedObs() {
    return this.tabRemoved$.asObservable();
  }

  removeTab<T>(data: T) {
    this.tabRemoved$.next(data);
  }
}
