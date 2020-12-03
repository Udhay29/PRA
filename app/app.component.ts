import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';

import { Message } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { NavigationMenuItem } from 'lib-platform-components';

import { UserService } from './shared/jbh-esa';
import { BrowserTitleService } from './shared/jbh-app-services/browser-title.service';

declare var JBH360Platform: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements OnInit, OnDestroy {
  isLocked = true;
  /**
   * sidebar states
   * @type {any}
   */
  sidebar: any = {
    left: {
      open: true,
      locked: true,
      changing: false
    },
    right: {
      open: false
    }
  };
  breakPoint = '';
  isAcccessApplication: boolean;
  platform = {};
  logged: any;
  shouldDisplayOverlay = true;
  msgs: Message[] = [];
  menuItem = [];
  navMenuItems: Array<NavigationMenuItem>;
  navItems = [];
  navMenuLocked = true;
  /**
   * [constructor description]
   * @param {AuthService} private auth
   * @param {Router} private router
   */
  constructor(public router: Router,
    private readonly ngZone: NgZone,
    private readonly browserTitleService: BrowserTitleService,
    private readonly user: UserService) {
    // translate.addLangs(['en', 'fr']);
    // translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    // translate.use(this.user.getUserLang());
  }

  /**
   * [ngOnInit description]
   *
   */
  ngOnInit() {
    this.initHeader();
    this.assignMenuItems();
    this.initializeNavMenu();
    this.setUserPage(this.user.getAuthenticationStatus());
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => this.browserTitleService.setPageTitle());
  }

  /**
   * [ngOnDestroy description]
   */
  ngOnDestroy() {
  }

  /**
   * resetSidebarState sets sidebar locked and open states back to default (false)
   * @param {[type]} event [description]
   */
  resetSidebarState(event) {
    this.sidebar.left.locked = false;
    this.sidebar.left.open = false;
    this.sidebar.right.open = false;
  }

  /**
   * toggleSidebarLeft is called when a left sidebar toggle event is emitted
   * @param {[type]} event [description]
   */
  toggleSidebarLeft(event) {
    this.sidebar.left.locked = !this.sidebar.left.locked;
    this.sidebar.left.open = !this.sidebar.left.open;
    this.sidebar.right.open = false;
  }

  /**
   * toggleSidebarLeftLock is called when the left sidebar lock toggle event is emitted
   * @param {[type]} event [description]
   */
  toggleSidebarLeftLock(evnet) {
    this.sidebar.left.locked = !this.sidebar.left.locked;
  }

  /**
   * toggleSidebarLeftOpen
   * @param {[type]} state [description]
   */
  toggleSidebarLeftOpen(state) {
    this.sidebar.left.open = state;
  }
  private setUserPage(status: number) {
    switch (status) {
      case 200:
        this.isAcccessApplication = true;
        break;
      case 401:
      case 404:
      case 500:
        this.isAcccessApplication = false;
        this.router.navigateByUrl(`error/${status}`, { replaceUrl: true });
        break;
      default:
        this.isAcccessApplication = false;
        this.router.navigateByUrl('error/401', { replaceUrl: true });
        break;
    }
  }

  assignMenuItems() {
    this.router.config.forEach((route, index) => {
      if (route.path && route.data && route.data.pathDisplayText && route.data.createSidebarEntry) {
        this.createNavMenuItems(route);
      }
    });
  }

  /** Initializes nav menu items  **/
  initializeNavMenu() {
    this.navMenuItems = [];
    this.navItems.forEach(navItem => {
      this.navMenuItems.push(NavigationMenuItem.fromObject(navItem));
    });
  }

   /** Triggers when nav menu toggled  **/
  onMenuPin(event: boolean): void {
    this.navMenuLocked = event;
  }

  /** Triggers when nav menu selected  **/
  onMenuSelect (event) {
  }

  /** Display menu error **/
  onMenuError(event: any): void {

  }

  private initHeader(): void {
    const config: object = {
      hamburgerClickFunction: (): void => {
        this.ngZone.run(() => {
          this.navMenuLocked = !this.navMenuLocked;
          this.isLocked = !this.isLocked;
          this.toggleSidebarLeft(this.navMenuLocked);
        });
      }
    };
    try {
      JBH360Platform.init(config);
    } catch (error) {}
  }

  /** Creates nav menu items array  **/
  private createNavMenuItems (route) {
    this.navItems.push({
      displayName: route.data.pathDisplayText,
      icon: route.data.pathIcon,
      href: { routerPath: route.path }
    });
  }
}
