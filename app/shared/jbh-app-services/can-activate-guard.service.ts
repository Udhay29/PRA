import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuardService implements CanActivate {

  constructor(private readonly router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {
    if (!this.router.navigated) {
      this.router.navigate(['/viewagreement'], {queryParams: route.queryParams});
    }
    return true;
  }
}
