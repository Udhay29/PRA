import { Directive, ElementRef, Input, HostListener, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appShortcut]'
})
export class ShortcutDirective implements OnInit, OnDestroy {

  // tslint:disable-next-line:no-input-rename
  @Input('appShortcut') appShortcut: string;
  @Input() focusKey: string;

  elementTagName: string;
  isFocused = false;

  keyedElement: any;

  @HostListener('window:keyup', ['$event'])
  keyboardInput(event: Event) {
    this.verifyKeyAndSetFocus(this.getKeyCode(event));
  }

  constructor(private readonly el: ElementRef) { }

  ngOnInit() {
    this.elementTagName = this.el.nativeElement.tagName.toLowerCase();
    if (!this.appShortcut) {
      this.setEventHandler();
    }
  }

  setEventHandler() {
    this.el.nativeElement.addEventListener('focus', () => {
      this.isFocused = true;
    }, true);
    this.el.nativeElement.addEventListener('blur', () => {
      this.isFocused = false;
    }, true);
  }

  ngOnDestroy() {
    this.el.nativeElement.removeEventListener('focus', () => {
      this.isFocused = true;
    }, true);
    this.el.nativeElement.removeEventListener('blur', () => {
      this.isFocused = false;
    }, true);
  }

  private verifyKeyAndSetFocus(keyCode: string) {
    if (keyCode === this.appShortcut) {
      this.setFocusToComponent(this.el.nativeElement);
    } else if (keyCode === this.focusKey) {
      this.setFocusToComponent(this.el.nativeElement, true);
    } else if (!this.appShortcut && this.isFocused) {
      this.keyedElement = this.el.nativeElement.querySelector(`[data-shortkey='${keyCode}']`);
      if (this.keyedElement) {
        this.elementTagName = this.keyedElement.tagName.toLowerCase();
        this.setFocusToComponent(this.keyedElement);
      }
    }
  }

  setFocusToComponent(selectedElm: any, focusKey: boolean = false) {
    switch (this.elementTagName) {
      case 'p-dropdown':
        const inputel = selectedElm.querySelector('input[role="listbox"]');
        if (inputel) {
          inputel.focus();
        }
        break;
      case 'p-tabview':
        const tabEl = selectedElm.querySelector('a[role="tab"]');
        if (tabEl) {
          tabEl.focus();
        }
        break;
      case 'p-orderlist':
        const searchField = selectedElm.querySelector('input[role="textbox"]');
        if (searchField) {
          searchField.focus();
        }
        break;
      case 'button':
      case 'p-button':
      case 'a':
        if (focusKey) {
          selectedElm.focus();
        } else {
          selectedElm.click();
          selectedElm.focus();
        }
        break;
      default:
        selectedElm.focus();
        break;
    }
  }

  private getKeyCode(e: Object): string {
    let keycode = '';
    if (e['ctrlKey']) {
      keycode = `ctrl+${e['key']}`;
      if (e['shiftKey']) {
        keycode = `ctrl+shift+${e['key']}`;
      } else if (e['altKey']) {
        keycode = `ctrl+alt+${e['key']}`;
      }
    } else if (e['altKey']) {
      keycode = `alt+${e['key']}`;
      if (e['shiftKey']) {
        keycode = `alt+shift+${e['key']}`;
      }
    } else if (e['shiftKey']) {
      keycode = `shift+${e['key']} `;
    } else {
      keycode = e['key'];
    }

    return keycode;
  }
}
