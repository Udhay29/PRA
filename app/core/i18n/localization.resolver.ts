import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { JbhTransLoader } from '../../core/i18n/jbh-trans.loader';

@Injectable()
export class LocalizationResolver implements Resolve<Observable<any>> {

    constructor() {
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return Observable.create(observer => {
          observer.next('true');
          observer.complete();
        });
   }
}
