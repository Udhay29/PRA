import { Inject, Directive, HostListener, Input, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Table } from 'primeng/table';
import * as _ from 'lodash';
import { timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Directive({
  selector: '[appTableKeynav]'
})
export class TableKeynavDirective implements OnDestroy, AfterViewInit {
  allTrs: any;
  trIndex = 1;
  activeTr: any;
  isFocused: boolean;
  selectedPage: any;

  searchElement: HTMLElement;
  filterElement: HTMLElement;
  overflowElement: HTMLElement;
  cartElement: HTMLElement;

  // Double click
  dblRightKey = 0;
  dblLeftKey = 0;
  leftClickSubscribeFlag = true;
  rightClickSubscribeFlag = true;

  @Input() tableRef: Table;

  @HostListener('window:keyup', ['$event'])
  onKeyUp(kbdEvent: KeyboardEvent): boolean | undefined {

    // Row Focus related logic's
    this.allTrs = this.tableRef.el.nativeElement.querySelectorAll('div.ui-table-scrollable-body > table > tbody > tr');
    if (kbdEvent.ctrlKey && kbdEvent.altKey) {
      this.setFocusTableElements(kbdEvent);
      return;
    }
    // Pagination focus
    if (kbdEvent.altKey) {
      this.setFocusToSearchOrPagination(kbdEvent);
      return;
    }
    if (this.dom.activeElement.nodeName !== 'INPUT') {
      // Table Logic's
      this.onTableKeyShortcuts(kbdEvent);

    }
    if (this.dom.activeElement.nodeName !== 'TR' && this.activeTr) {
      this.activeTr.classList.remove('ui-state-highlight');
    }
    if (this.dom.activeElement.nodeName === 'INPUT' && (kbdEvent.key === 'Space' || kbdEvent.key === 'Spacebar')) {
      return;
    }
    return;
  }

  constructor(private readonly el: ElementRef, @Inject(DOCUMENT) private readonly dom: any) {
    el.nativeElement.addEventListener('focus', () => {
      this.isFocused = true;
    }, true);
    el.nativeElement.addEventListener('blur', () => {
      this.isFocused = false;
    }, true);
  }

  ngAfterViewInit() {
    this.searchElement = this.el.nativeElement.querySelector('.searchHolder input') as HTMLElement;
    this.filterElement = this.el.nativeElement.querySelector('.iconsHolder .icon-Filter_Solid') as HTMLElement;
    this.overflowElement = this.el.nativeElement.querySelector('.iconsHolder .icon-Menu_Overflow') as HTMLElement;
    this.cartElement = this.el.nativeElement.querySelector('.iconsHolder .icon-button-cart') as HTMLElement;
  }


  ngOnDestroy() {
    this.el.nativeElement.removeEventListener('focus', () => {
      this.isFocused = true;
    }, true);
    this.el.nativeElement.removeEventListener('blur', () => {
      this.isFocused = false;
    }, true);
  }

  setFocusToSelectedPage() {
    timer(10).subscribe((tmr: any) => {
      this.selectedPage = this.el.nativeElement.querySelector('.ui-paginator-pages a.ui-state-active');
      if (this.selectedPage) {
        this.selectedPage.focus();
      }
    });
  }

  setFocusTableElements(kbdEvent) {
    switch (kbdEvent.key.toLocaleLowerCase()) {
      case 'r':
        this.trIndex = 0;
        this.activeTr = this.allTrs[this.trIndex] as HTMLElement;
        this.tableRef.selection = [this.tableRef.value[0]];
        this.activeTr.setAttribute('tabindex', '0');
        this.activeTr.classList.add('ui-state-highlight');
        this.activeTr.focus();
        break;
      case 'o':
        if (this.overflowElement) {
          this.overflowElement.click();
          this.overflowElement.focus();
        }
        break;
      case 'm':
        if (this.cartElement) {
          this.cartElement.click();
          this.cartElement.focus();
        }
        break;
      case 'f':
        if (this.filterElement) {
          this.filterElement.click();
          this.filterElement.focus();
        }
        break;
      default:
        break;
    }
  }

  setFocusToSearchOrPagination(key) {
    switch (key.key.toLocaleLowerCase()) {
      case 'p':
        this.setFocusToSelectedPage();
        break;
      case 's':
        if (this.searchElement) {
          this.searchElement.focus();
        }
        break;
      default:
        break;
    }
  }

  onTableKeyShortcuts(kbdEvent) {
    this.arrowKeysShortcut(kbdEvent);
    this.spaceAndEnterShortcut(kbdEvent);
  }
  arrowKeysShortcut(kbdEvent) {
    // left arrow
    if (kbdEvent.key === 'ArrowRight' || kbdEvent.key === 'Right') {
      this.onLeftArrowClick(kbdEvent);
    }
    // right arrow
    if (kbdEvent.key === 'ArrowLeft' || kbdEvent.key === 'Left') {
      this.onRightArrowClick(kbdEvent);
    }
    // arrowdown - 40
    if (this.tableRef.selection && (kbdEvent.key === 'ArrowDown' || kbdEvent.key === 'Down') && this.trIndex !== (this.allTrs.length - 1)) {
      this.trIndex++;
      this.activeTr = this.allTrs[this.trIndex];
      this.tableRef.selection = [this.tableRef.value[this.trIndex]];
      this.activeTr.setAttribute('tabindex', '-1');
      this.activeTr.focus();
    }
    // arrowup - 38
    if (this.tableRef.selection && (kbdEvent.key === 'ArrowUp' || kbdEvent.key === 'Up') && this.trIndex !== 0) {
      this.trIndex--;
      this.activeTr = this.allTrs[this.trIndex];
      this.tableRef.selection = [this.tableRef.value[this.trIndex]];
      this.activeTr.setAttribute('tabindex', '-1');
      this.activeTr.focus();
    }
  }
  spaceAndEnterShortcut(kbdEvent) {
    // enter - 13
    if (kbdEvent.key === 'Enter' && this.activeTr) {
      this.tableRef.selection = [];
      this.activeTr.click();
      return;
    }
    // spacebar - 32 - checkbox select
    if (this.tableRef.selection && (kbdEvent.keyCode === 32 || kbdEvent.key === 'Spacebar')) {
      this.activeTr.querySelector('input[type="checkbox"]').click();
      this.activeTr.querySelector('input[type="checkbox"]').focus();
      this.activeTr.setAttribute('tabindex', '-1');
      this.activeTr.focus();
    }
  }
  onLeftArrowClick(kbdEvent) {
    if (this.dblLeftKey !== 0 && (kbdEvent.key === 'ArrowRight' || kbdEvent.key === 'Right')) {
      const element = this.tableRef.el.nativeElement.querySelector('.ui-paginator-last') as HTMLElement;
      element.click();
      this.setFocusToSelectedPage();
      this.leftClickSubscribeFlag = false;
      this.dblLeftKey = 0;
      return;
    } else {
      this.dblLeftKey = 1;
      this.leftClickSubscribeFlag = true;
      timer(300).pipe(takeWhile(() => this.leftClickSubscribeFlag)).subscribe(() => {
        this.dblLeftKey = 0;
        const element = this.tableRef.el.nativeElement.querySelector('.ui-paginator-next') as HTMLElement;
        element.click();
        this.setFocusToSelectedPage();
        return;
      });

    }
  }
  onRightArrowClick(kbdEvent) {
    if (this.dblRightKey !== 0 && (kbdEvent.key === 'ArrowLeft' || kbdEvent.key === 'Left')) {
      const element = this.tableRef.el.nativeElement.querySelector('.ui-paginator-first') as HTMLElement;
      element.click();
      this.setFocusToSelectedPage();
      this.rightClickSubscribeFlag = false;
      this.dblRightKey = 0;
      return;
    } else {
      this.dblRightKey = 1;
      this.rightClickSubscribeFlag = true;
      timer(300).pipe(takeWhile(() => this.rightClickSubscribeFlag)).subscribe(() => {
        this.dblRightKey = 0;
        const element = this.tableRef.el.nativeElement.querySelector('.ui-paginator-prev') as HTMLElement;
        element.click();
        this.setFocusToSelectedPage();
        return;
      });

    }
  }


}
