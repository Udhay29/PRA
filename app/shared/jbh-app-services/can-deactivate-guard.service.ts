import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: (component, route, state, nextState) => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuardService implements CanDeactivate<CanComponentDeactivate> {

  constructor() { }

  canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot) {
    return component.canDeactivate ? component.canDeactivate(component, route, state, nextState) : true;
  }
}
