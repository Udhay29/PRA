import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class BrowserTitleService {

  private readonly applicationTitle = 'Pricing — J.B. Hunt 360';

  constructor (private readonly router: Router, private readonly titleService: Title) { }

  setPageTitle () {
    const pageTitle = this.recursivelyGenerateTitle(this.router.routerState.snapshot.root);
    const title = (pageTitle) ? `${pageTitle} — ${this.applicationTitle}` : this.applicationTitle;
    this.titleService.setTitle(title);
  }

  private recursivelyGenerateTitle (snapshot: ActivatedRouteSnapshot) {
    let title = '';
    if (snapshot) {
      title = (snapshot.data && snapshot.data['title']) ? snapshot.data['title'] : '';
      title = this.generateChildTitle(snapshot, title);
    }
    return title;
  }

  private generateChildTitle (snapshot: ActivatedRouteSnapshot, title) {
    if (snapshot.firstChild) {
      let childTitle = this.recursivelyGenerateTitle(snapshot.firstChild);
      childTitle = childTitle === title ? '' : childTitle;
      title = (title) ? (childTitle ? `${childTitle} — ${title}` : title) : childTitle;
    }
    return title;
  }
}
