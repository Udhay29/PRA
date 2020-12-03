import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
    canDeactivate: (component, route, state, nextState) => Observable<boolean> | Promise<boolean> | boolean;
}

export interface IndexType {
    key: boolean;
    message: string;
}
