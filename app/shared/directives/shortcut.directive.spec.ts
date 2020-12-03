import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { ShortcutDirective } from './shortcut.directive';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  template: `<button  appShortcut='ctrl+alt+o' class='addCommentBtn'></button>`
})

class TestComponent {
}

describe('ShortcutDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;

  const isFocused = false;
  const focusKey = false;
  let directive: ShortcutDirective;

  beforeEach(() => {
    const elementRefStub = {
      nativeElement: {
        tagName: 'button',
        addEventListener: () => ({}),
        querySelector: () => ({}),
        removeEventListener: () => ({}),
        click: () => ({}),
        focus: () => ({}),
        class: 'selectedElementClass'
      }
    };
    TestBed.configureTestingModule({
      declarations: [TestComponent, ShortcutDirective],
      providers: [
        ShortcutDirective,
        { provide: ElementRef, useValue: elementRefStub }
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
    directive = TestBed.get(ShortcutDirective);
  });
  it('can load instance', () => {
    directive.appShortcut = 'ctrl+alt+2';
    expect(directive).toBeTruthy();
  });
  xit('can call setEventHandler', () => {
    directive.setEventHandler();
    expect(directive.setEventHandler).toBeTruthy();
  });
  xit('can call ngOnDestroy', () => {
    directive.ngOnDestroy();
    expect(directive.ngOnDestroy).toBeTruthy();
  });
  it('should invoke keyboard event for ctrl,alt,2 on button', () => {
    directive.appShortcut = 'ctrl+alt+2';
    const event: Event = new KeyboardEvent('keyup', {
      ctrlKey: true, altKey: true,
      'key': '2'
    });
    directive.elementTagName = 'button';
    directive.keyboardInput(event);
  });
  it('should invoke keyboard event for ctrl,alt,2 on button', () => {
    directive.appShortcut = 'ctrl+alt+o';
    const event: Event = new KeyboardEvent('keyup', {
      ctrlKey: true, altKey: true,
      'key': 'o'
    });
    directive.elementTagName = 'button';
    directive.keyboardInput(event);
  });
  it('should invoke keyboard event for ctrl,alt,2 for default div', () => {
    directive.appShortcut = 'ctrl+alt+2';
    const event: Event = new KeyboardEvent('keyup', {
      ctrlKey: true, altKey: true,
      'key': '2'
    });
    directive.elementTagName = 'div';
    directive.keyboardInput(event);
  });
  it('should invoke keyboard event ArrowDown', () => {
    const event: Event = new KeyboardEvent('ArrowDown', {
      'key': 'ArrowDown'
    });
    directive.keyboardInput(event);
  });
  it('should invoke keyboard event ArrowUp', () => {
    const event: Event = new KeyboardEvent('ArrowUp', {
      'key': 'ArrowUp'
    });
    directive.keyboardInput(event);
  });
  it('should invoke setFocusToComponent for drop down', () => {
    directive.elementTagName = 'p-dropdown';
    const selectedElm = document.createElement('input');
    selectedElm.setAttribute('role', 'listbox');
    directive.setFocusToComponent(selectedElm);
  });
  it('should invoke setFocusToComponent for tab view', () => {
    directive.elementTagName = 'p-tabview';
    const selectedElm = document.createElement('a');
    selectedElm.setAttribute('role', 'tab');
    directive.setFocusToComponent(selectedElm);
  });
  it('should invoke setFocusToComponent for orderlist', () => {
    directive.elementTagName = 'p-orderlist';
    const selectedElm = document.createElement('input');
    selectedElm.setAttribute('role', 'textbox');
    directive.setFocusToComponent(selectedElm);
  });
  it('should invoke setFocusToComponent for tableheadercheckbox', () => {
    directive.elementTagName = 'p-tableheadercheckbox';
    const selectedElm = document.createElement('div');
    selectedElm.setAttribute('class', 'ui-chkbox ui-widget');
    const el = document.createElement('input');
    selectedElm.appendChild(el);
    directive.setFocusToComponent(selectedElm, true);
  });
});
