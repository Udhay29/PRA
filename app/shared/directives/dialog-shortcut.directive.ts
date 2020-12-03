import { Directive, Inject, Input, HostListener, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Directive({
  selector: '[appDialogShortcut]'
})
export class DialogShortcutDirective {
  dialogInstance: any;
  tempNode: HTMLElement;
  // tslint:disable-next-line:no-input-rename

  @Input('appDialogShortcut') set appDialogShortcut(ref: any) {
    this.dialogInstance = ref;
  }

  @HostListener('window:keyup', ['$event'])
  keyboardInput(event: Event) {
    if (this.dialogInstance && this.dialogInstance.visible) {
      this.verifyKeyAndSetFocus(this.getKeyCode(event));
    }
  }

  constructor() { }

  verifyKeyAndSetFocus(keyCode: string) {
    if (this.dialogInstance.containerViewChild) {
      this.tempNode = this.dialogInstance.containerViewChild.nativeElement.querySelector(`[data-shortkey='${keyCode}']`);
    } else {
      this.tempNode = this.dialogInstance.el.nativeElement.querySelector(`[data-shortkey='${keyCode}']`);
    }
    if (this.tempNode) {
      this.tempNode.click();
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


