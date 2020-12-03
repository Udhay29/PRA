import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface BroadcastEvent {
  key: any;
  data?: any;
}

@Injectable()
export class BroadcasterService {

  private readonly _eventBus: BehaviorSubject<BroadcastEvent>;

  constructor() {
    this._eventBus = new BehaviorSubject<BroadcastEvent>({ key: 'test', data: 'test' });
  }

  broadcast(key: any, data?: any): void {
    this._eventBus.next({ key, data });
  }

  on<T>(key: any): Observable<T> {
    return this._eventBus.asObservable().pipe(
      filter((event: any) => event.key === key),
      map((event: any) => event.data as T));
  }

  getValue(): BroadcastEvent {
    return this._eventBus.getValue();
  }
}
