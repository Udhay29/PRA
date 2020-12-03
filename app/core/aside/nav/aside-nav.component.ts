import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Event, Router, Routes, Route, NavigationEnd, ResolveEnd } from '@angular/router';

@Component({
  selector: 'app-aside-nav',
  templateUrl: './aside-nav.component.html',
  styleUrls: ['./aside-nav.component.scss']
})
export class AsideNavComponent implements OnInit {

  public routes: Routes;

  constructor(
    private readonly _router: Router
  ) { }

  /**
   * in the beginning
   */
  ngOnInit() {
    this.routes = this._router.config;

    // initially all sidebar entries with children are not open
    this.routes.forEach((route) => route.data = { ...route.data, openSidebarEntry: false });

    // router event subs
    this._router.events.subscribe((event: Event) => {
      // EVENT NAVIGATION START
      if (event instanceof ResolveEnd) {
        this.routes.forEach((route) => route.data.openSidebarEntry = false);
      }
      // EVENT NAVIGATION END
      if (event instanceof NavigationEnd) {
        this.routes.forEach((route) => {
          if ((route.path !== '' && route.path !== '**') && event.url.includes('\/' + route.path)) {
            route.data.openSidebarEntry = true;
          }
        });
      }
    });
  }

  /**
   * show consumes a route object and determines if a sidebar entry
   * should be shown (true or false)
   * @param  {Route}   route application route configuration object
   * @return {boolean}       should a sidebar entry be shown
   */
  show(route): boolean {
    return (
      ('data' in route) && // route has data key
      ('createSidebarEntry' in route.data) && // data has create side bar entry key
      route.data.createSidebarEntry === true // side bar entry key is true
    );
  }

  /**
   * getDisplayText consumes a route object and returns either the display text
   * or the path if no display text was found
   * @param  {Route}   route route object
   * @return {string}        display text
   */
  getDisplayText(route): string {
    return (
      ('data' in route) && // route has data key
      ('pathDisplayText' in route.data) // data has display text
    ) ? route.data.pathDisplayText : route.path;
  }

  /**
   * [getRouterLinkURL description]
   * @param  {[type]} route      [description]
   * @param  {[type]} childRoute [description]
   * @return {string}            [description]
   */
  getRouterLinkURL(route, childRoute): string {
    return !childRoute ? route.path : `${route.path}/${childRoute.path}`;
  }

  /**
   * hasChildren returns true or false whether or not this route has children
   * @param  {Route}   route route object
   * @return {boolean}       true or false this route has children
   */
  hasChildren(route): boolean {
    return (
      ('children' in route) && // has children property
      (route.children.length > 0) // and the array is not empty
    );
  }

  /**
   * menuItemClick takes a route object and navigates to URL by route path
   * @param {Route} route      [description]
   * @param {Route} childRoute [description]
   */
  menuItemClick(route: Route, childRoute: Route) {
    if (route.data.openSidebarEntry === false) { // if route is not open
      // if this route is not active
      if (!this._router.url.includes('\/' + route.path)) {
        this.navigateToRoute(route, childRoute); // navigate to the route
      } else { route.data.openSidebarEntry = true; }
    } else { route.data.openSidebarEntry = false; }
  }

  /**
   * [navigateToRoute description]
   * @param {Route} route      [description]
   * @param {Route} childRoute [description]
   */
  navigateToRoute(route: Route, childRoute: Route) {
    this._router.navigateByUrl(this.getRouterLinkURL(route, childRoute));
  }

  /**
   * [getRouteIcon description]
   * @param  {[type]} route [description]
   * @return {string}       [description]
   */
  getRouteIcon(route): string {
    return (
      ('data' in route) && // route has data key
      ('pathIcon' in route.data) // data has display text
    ) ? route.data.pathIcon : '';
  }

  /**
   * [routeIsActive description]
   * @param  {[type]}  route      [description]
   * @param  {[type]}  childRoute [description]
   * @return {boolean}            [description]
   */
  routeIsActive(route, childRoute): boolean {
    return this._router.isActive(this.getRouterLinkURL(route, childRoute), false);
  }
}
