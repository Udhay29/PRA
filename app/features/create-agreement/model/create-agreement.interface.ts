import { Observable } from 'rxjs';
export interface NavigationAlert {
  key: boolean;
  message: string;
  type: string;
}

export interface CanComponentDeactivate {
  canDeactivate: (component, route, state, nextState) => Observable<boolean> | Promise<boolean> | boolean;
}
