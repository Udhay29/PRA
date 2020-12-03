import { Directive, HostListener, Input, AfterViewInit } from '@angular/core';
import { Menu } from 'primeng/menu';
@Directive({
  selector: '[appMenuOverlay]'
})
export class MenuOverlayDirective implements AfterViewInit {
  // tslint:disable-next-line:no-input-rename
  @Input('appMenuOverlay') set appMenuOverlay(ref: Menu) {
    if (ref) {
      this.menuInstance = ref;
    }
  }
  menuInstance: Menu;
  searchElement: HTMLElement[];
  counter = -1;

  @HostListener('window:keyup', ['$event'])
  onKeyUp(kbdEvent: KeyboardEvent) {
    if (this.menuInstance && this.menuInstance.containerViewChild.nativeElement.style.display === 'block') {
      switch (kbdEvent['keyCode']) {
        case 40:
          if (this.searchElement.length - 1 > this.counter) {
            this.counter++;
          }
          this.searchElement[this.counter].focus();
          break;
        case 38:
          (this.counter > 0) ? this.counter-- : this.counter = 0;
          this.searchElement[this.counter].focus();
          break;
        case 27:
          this.menuInstance.hide();
          break;
        default:
          break;
      }
    }
  }
  constructor() { }

  ngAfterViewInit() {
    this.searchElement = this.menuInstance.containerViewChild.nativeElement.querySelectorAll('ul li .ui-menuitem-link');
  }
}
