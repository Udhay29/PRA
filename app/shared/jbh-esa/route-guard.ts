import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from './user.service';

@Injectable()
export class RouteGuard implements CanActivate {

    constructor(
        private readonly userService: UserService,
        private readonly router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if (this.userService.hasAccess(state.url, 'R')) {
            return true;
        }
        this.router.navigateByUrl('/error/401');
        return false;
    }
}
